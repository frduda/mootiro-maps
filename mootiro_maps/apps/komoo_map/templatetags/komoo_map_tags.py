#coding: utf-8
import json
from django import template
from django.conf import settings
from django.utils.translation import ugettext as _

from komoo_map.models import (get_models, get_models_json, POLYGON, LINESTRING,
                              MULTILINESTRING, POINT, MULTIPOINT)
from main.utils import to_json

register = template.Library()


def _parse_args(*args):
    parsed_args = {}
    for arg in args:
        if arg:
            a = arg.split('=')
            parsed_args[a[0]] = a[1]
    return parsed_args


@register.inclusion_tag('komoo_map/komoo_map_tooltip_templatetag.html')
def komoo_map_tooltip():
    pass


@register.inclusion_tag('komoo_map/komoo_map_objects_list_templatetag.html',
                        takes_context=True)
def komoo_map_objects_list(context, arg1='', arg2=''):
    geometries_titles = {
        POLYGON: _('Add shape'),
        LINESTRING: _('Add line'),
        MULTILINESTRING: _('Add line'),
        POINT: _('Add point'),
        MULTIPOINT: _('Add point'),
    }
    parsed_args = _parse_args(arg1, arg2)
    prefix = parsed_args.get('prefix', 'item')
    show_geometries = parsed_args.get('show_geometries', False)
    help_strs = {
        'Community': _('Add a community. Communities can be regions, districts, villages, slums, towns, etc.'),
        'Need': _('Add a need. Needs can be demands or challenges of the local community, for instance an area that suffers from waste disposal, lack of public services or broken streetlights.'),
        'Resource': _('Add a resource, for example a library, a cultural center or a public park.'),
        'Organization': _('Add an organization, for instance a nonprofit organization, a company or government institution.'),
    }
    objects = [{
        'type': obj.__name__,
        'title': _(obj.get_map_attr('title') or obj.__name__),
        'help': help_strs.get(obj.__name__, ''),
        'geometries': [{
            'type': geometry,
            'title': _(geometries_titles.get(geometry, geometry))
        } for geometry in obj.get_map_attr('geometries')]
    } for obj in get_models() if obj.get_map_attr('editable')]

    return {'prefix': prefix,
            'objects': objects,
            'show_geometries': show_geometries,
            }


#@register.inclusion_tag('komoo_map/komoo_map_templatetag.html',
#        takes_context=True)
@register.inclusion_tag('komoo_map/map_templatetag.html',
                        takes_context=True)
def komoo_map(context, geojson={}, arg1='', arg2='', arg3='', arg4='',
              arg5='', arg6='', arg7='', arg8='', arg9='', arg10=''):
    """
    The syntax:
        {% komoo_map <geojson> [<project_id>] [type] [<width>] [<height>]
        [<zoom>] [panel] [ajax] [lazy] [edit_button] [maptype] %}
    """
    if isinstance(arg1, int):
        arg1 = 'project={}'.format(arg1)
    parsed_args = _parse_args(arg1, arg2, arg3, arg4, arg5, arg6, arg7,
                              arg8, arg9, arg10)
    type = parsed_args.get('type', 'main')
    width = parsed_args.get('width', '200')
    height = parsed_args.get('height', '200')
    zoom = parsed_args.get('zoom', 16)
    project = parsed_args.get('project', None)
    panel = parsed_args.get('panel', ('komoo_map/panel.html' if not type in
                                      ('preview', 'tooltip', 'view') else ''))
    ajax = parsed_args.get('ajax', 'True').lower() != 'false'
    lazy = parsed_args.get('lazy', 'False').lower() != 'false'
    edit_button = parsed_args.get('edit_button', 'False').lower() != 'false'
    maptype = parsed_args.get('maptype', 'clean')

    editable = type in ('main', 'editor')
    if geojson:
        geojson_dict = json.loads(geojson)
        for feature in geojson_dict.get('features', []):
            if 'properties' in feature and editable:
                feature['properties']['alwaysVisible'] = True
        geojson = to_json(geojson_dict)

    if not width.endswith('%') and not width.endswith('px'):
        width = width + 'px'
    if not height.endswith('%') and not height.endswith('px'):
        height = height + 'px'

    if getattr(settings, 'KOMOO_DISABLE_MAP', False):
        type = 'disabled'

    return dict(type=type, width=width, height=height, zoom=zoom, panel=panel,
                lazy=lazy, geojson=geojson, edit_button=edit_button,
                project=project, ajax=ajax, editable=editable, maptype=maptype,
                feature_types_json=get_models_json(),
                STATIC_URL=settings.STATIC_URL,
                LANGUAGE_CODE=settings.LANGUAGE_CODE)
