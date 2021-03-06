#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.gis.db import models
from django.contrib.gis.measure import Distance
from django.core.urlresolvers import reverse

from django.utils.translation import ugettext_lazy as _

from django.template.defaultfilters import slugify
from lib.taggit.managers import TaggableManager
from komoo_map.models import GeoRefModel, POLYGON
from authentication.models import User
from main.mixins import BaseModel
from main.models import ContactsField
from search.signals import index_object_for_search


class Community(GeoRefModel, BaseModel):
    name = models.CharField(max_length=256, blank=False)
    # Auto-generated url slug. It's not editable via ModelForm.
    slug = models.SlugField(max_length=256, blank=False, db_index=True)
    population = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    short_description = models.CharField(max_length=250, null=True, blank=True)
    contacts = ContactsField()
    tags = TaggableManager()

    # Meta info
    creator = models.ForeignKey(User, editable=False, null=True,
                                related_name='created_communities')
    creation_date = models.DateTimeField(auto_now_add=True)
    last_editor = models.ForeignKey(User, editable=False, null=True,
                                    blank=True)
    last_update = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name

    class Map:
        title = _('Community')
        editable = True
        background_color = '#ffc166'
        border_color = '#ff2e2e'
        geometries = (POLYGON, )
        form_view_name = 'new_community'
        min_zoom_geometry = 10
        max_zoom_geometry = 100
        #min_zoom_point = 0
        #max_zoom_point = 0
        #min_zoom_icon = 0
        #max_zoom_icon = 0
        zindex = 5

    class Meta:
        verbose_name = "community"
        verbose_name_plural = "communities"

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        r_ = super(Community, self).save(*args, **kwargs)
        index_object_for_search.send(sender=self, obj=self)
        return r_

    image = "img/community.png"
    image_off = "img/community-off.png"
    default_logo_url = "img/logo-community.png"

    # TODO: order communities from the database
    def closest_communities(self, max=3, radius=Distance(km=25)):
        center = self.geometry.centroid
        unordered = Community.objects.filter(
                        polys__distance_lte=(center, radius))
        closest = sorted(unordered, key=lambda c: c.geometry.distance(center))
        return closest[1:(max + 1)]

    # url aliases
    @property
    def view_url(self):
        return reverse('view_community', kwargs={'id': self.id})

    @property
    def edit_url(self):
        return reverse('edit_community', kwargs={'id': self.id})

    @property
    def admin_url(self):
        return reverse('admin:{}_{}_change'.format(self._meta.app_label,
            self._meta.module_name), args=[self.id])

    @property
    def perm_id(self):
        return 'c%d' % self.id

    # ==========================================================================
    # Utils

    # def from_dict(self, data):
    #     keys = ['id', 'name', 'contact', 'geojson',  'creation_date',
    #             'is_admin', 'is_active', 'about_me']
    #     date_keys = ['creation_date']
    #     build_obj_from_dict(self, data, keys, date_keys)

    def to_dict(self):
        fields_and_defaults = [
            ('name', None), ('slug', None), ('population', None),
            ('description', None), ('short_description ', None),
            ('creator_id', None), ('creation_date', None),
            ('last_editor_id', None), ('last_update', None),
            ('geojson', {}), ('contacts', {})
        ]
        dict_ = {v[0]: getattr(self, v[0], v[1]) for v in fields_and_defaults}
        dict_['tags'] = [tag.name for tag in self.tags.all()]
        return dict_

    # def is_valid(self, ignore=[]):
    #     self.errors = {}
    #     valid = True
    #     return valid
