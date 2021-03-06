#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

from django.template import RequestContext
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render_to_response
from django.db.models.loading import get_model
from fileupload.models import UploadedFile

from komoo_map.models import get_editable_models, get_models_json
from komoo_project.models import Project
from main.utils import create_geojson, to_json


def default_layers():
    return [{
            'name': m.get_map_attr('title') or m.__name__,
            'id': m.__name__,
            'fillColor': m.get_map_attr('background_color'),
            'strokeColor': m.get_map_attr('border_color'),
            'icon': [getattr(m, 'image'), getattr(m, 'image_off')],
            'rule': {'operator': 'is', 'property': 'type', 'value': m.__name__}
            } for m in get_editable_models()]


def feature_types(request):
    return HttpResponse(get_models_json(), mimetype="application/x-javascript")


def layers(request):
    '''Default layers'''
    return HttpResponse(
        to_json(default_layers()),
        mimetype="application/x-javascript")


def project_layers(request, proj_id=None):
    project = get_object_or_404(Project, id=proj_id)
    layers = project.layers
    if not layers:
        layers = default_layers()
    return HttpResponse(
        to_json(layers),
        mimetype="application/x-javascript")


def project_json(request, proj_id=None):
    project = get_object_or_404(Project, id=proj_id)
    return HttpResponse(
        project.json,
        mimetype="application/x-javascript")


def geojson(request, app_label, model_name, obj_id):
    model = get_model(app_label, model_name)
    obj = get_object_or_404(model, id=obj_id) if model else None
    geojson = getattr(obj, 'geojson', create_geojson([obj]))
    return HttpResponse(geojson, mimetype="application/x-javascript")


def related(request, app_label, model_name, obj_id):
    model = get_model(app_label, model_name)
    obj = get_object_or_404(model, id=obj_id) if model else None
    return HttpResponse(create_geojson(getattr(obj, 'related_items', [])),
                        mimetype="application/x-javascript")


def tooltip(request, zoom, app_label, model_name, obj_id):
    model = get_model(app_label, model_name)
    obj = get_object_or_404(model, id=obj_id) if model else None
    template = getattr(obj, 'tooltip_template', 'komoo_map/tooltip.html')
    return render_to_response(template, {'object': obj, 'zoom': zoom},
                              context_instance=RequestContext(request))


def info_window(request, zoom, app_label, model_name, obj_id):
    model = get_model(app_label, model_name)
    obj = get_object_or_404(model, id=obj_id) if model else None
    images = UploadedFile.get_files_for(obj)
    try:
        image = images.get(cover=True)
    except UploadedFile.DoesNotExist:
        image = None
    if not image:  # Have no selected image. Get the first one.
        try:
            image = images.all()[:1].get()
        except UploadedFile.DoesNotExist:
            image = None
    template = getattr(obj, 'info_window_template',
                       'komoo_map/info_window.html')
    return render_to_response(template, {'object': obj, 'zoom': zoom, 'image': image},
                              context_instance=RequestContext(request))
