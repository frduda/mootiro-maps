#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

import json
import logging

from django.core.urlresolvers import reverse
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import simplejson
from django.contrib.auth.decorators import login_required
from django.contrib.gis.geos import Polygon

from annoying.decorators import render_to
from lib.taggit.models import TaggedItem

from community.models import Community
from need.models import Need, TargetAudience
from need.forms import NeedForm
from main.utils import create_geojson

logger = logging.getLogger(__name__)


@render_to('need/edit.html')
@login_required
def edit(request, community_slug="", need_slug=""):
    logger.debug('acessing need > edit')

    if request.is_ajax():
        template = "need/edit_ajax.html"
    else:
        template = "need/edit.html"

    community = get_object_or_404(Community, slug=community_slug) \
                    if community_slug else None
    if need_slug:
        need = get_object_or_404(Need, slug=need_slug, community=community) \
                if community else get_object_or_404(Need, slug=need_slug)
    else:
        need = Need(creator=request.user)
        if community:
            need.community = community

    if request.POST:
        post = request.POST
        if community:
            post = request.POST.copy()  # needed because request.POST is immutable
            post['community'] = community.id
        form = NeedForm(post, instance=need)
        if form.is_valid():
            need = form.save()

            args = (need.community.slug, need.slug) if need.community else (need.slug,)
            redirect_url = reverse('view_need', args=args)
            if not request.is_ajax():
                return redirect(redirect_url)
            rdict = dict(redirect=redirect_url)
        else:
            rdict = dict(form=form, community=community)
    else:
        form = NeedForm(instance=need)
        if community:
            form.fields.pop('community')
        rdict = dict(form=form, community=community)
    geojson = create_geojson([need], convert=False)
    if geojson and geojson.get('features'):
        geojson['features'][0]['properties']['userCanEdit'] = True
    rdict['geojson'] = json.dumps(geojson)
    return render(request, template, rdict)


@render_to('need/view.html')
def view(request, community_slug=None, need_slug=None):
    # if the need has no community pass an empty string
    logger.debug('acessing need > view')
    filters = dict(slug=need_slug)
    if community_slug:
        filters['community__slug'] = community_slug
    need = get_object_or_404(Need, **filters)
    geojson = create_geojson([need])
    return dict(need=need, community=need.community, geojson=geojson)


@render_to('need/list.html')
def list(request, community_slug=''):
    logger.debug('acessing need > list')
    if community_slug:
        community = get_object_or_404(Community, slug=community_slug)
        needs = community.needs.all().order_by('title')
    else:
        community = None
        needs = Need.objects.all().order_by('title')
    return dict(community=community, needs=needs)


# DOES NOT SIMPLY WORK WITH @ajax_request, please test before commit!
def tag_search(request):
    logger.debug('acessing need > tag_search')
    term = request.GET['term']
    qset = TaggedItem.tags_for(Need).filter(name__istartswith=term)
    tags = [t.name for t in qset]
    return HttpResponse(simplejson.dumps(tags),
                mimetype="application/x-javascript")


# DOES NOT SIMPLY WORK WITH @ajax_request, please test before commit!
def target_audience_search(request):
    logger.debug('acessing need > target_audience_search')
    term = request.GET['term']
    qset = TargetAudience.objects.filter(name__istartswith=term)
    target_audiences = [ta.name for ta in qset]
    return HttpResponse(simplejson.dumps(target_audiences),
                mimetype="application/x-javascript")


def needs_geojson(request):
    bounds = request.GET.get('bounds', None)
    x1, y2, x2, y1 = [float(i) for i in bounds.split(',')]
    polygon = Polygon(((x1, y1), (x1, y2), (x2, y2), (x2, y1), (x1, y1)))
    needs = Need.objects.filter(
            Q(points__intersects=polygon) |
            Q(lines__intersects=polygon) |
            Q(polys__intersects=polygon)
    )
    geojson = create_geojson(needs)
    return HttpResponse(json.dumps(geojson),
        mimetype="application/x-javascript")
