#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse
from django.template.defaultfilters import slugify
from lib.taggit.managers import TaggableManager

from authentication.models import User
from main.mixins import BaseModel
from main.models import ContactsField
from community.models import Community
from komoo_map.models import GeoRefModel, POLYGON, LINESTRING, POINT
from search.signals import index_object_for_search


class NeedCategory(models.Model):
    name = models.CharField(max_length=64, blank=False)

    # Adding categories to be translated.
    # Probably there is a better way to do this.
    categories = [
        _('Culture'),
        _('Education'),
        _('Environment'),
        _('Health'),
        _('Housing'),
        _('Local economy'),
        _('Mobility'),
        _('Social service'),
        _('Sport'),
        _('Security'),
    ]

    def __unicode__(self):
        return unicode(self.name)

    @classmethod
    def get_image(cls, name):
        return "img/need_categories/%s.png" % slugify(name)

    @classmethod
    def get_image_off(cls, name):
        return "img/need_categories/%s-off.png" % slugify(name)

    @property
    def image(self):
        return self.get_image(self.name)

    @property
    def image_off(self):
        return self.get_image_off(self.name)

    # FIXME: this is kludge! depends on user language to work!
    @classmethod
    def backtrans(klass, trans_name):
        idnames = [nc.name for nc in klass.objects.all()]
        btdict = {_(name): name for name in idnames}
        return btdict[trans_name] if trans_name in btdict else trans_name


class TargetAudience(models.Model):
    name = models.CharField(max_length=64, unique=True, blank=False)

    def __unicode__(self):
        return self.name


class Need(GeoRefModel, BaseModel):
    class Meta:
        verbose_name = "need"
        verbose_name_plural = "needs"

    name = models.CharField(max_length=256, blank=False)
    slug = models.CharField(max_length=256, blank=False, db_index=True)
    description = models.TextField()
    short_description = models.CharField(max_length=250, null=True, blank=True)

    # Meta info
    creator = models.ForeignKey(User, editable=False, null=True,
                                related_name='created_needs')
    creation_date = models.DateTimeField(auto_now_add=True)
    last_editor = models.ForeignKey(User, editable=False, null=True, blank=True)
    last_update = models.DateTimeField(auto_now=True)

    contacts = ContactsField()

    # Relationships
    community = models.ManyToManyField(Community, related_name="needs", # TODO: remove-me
                                       null=True, blank=True)
    categories = models.ManyToManyField(NeedCategory)
    target_audiences = models.ManyToManyField(TargetAudience, blank=False)

    tags = TaggableManager()

    class Map:
        title = _('Need')
        editable = True
        background_color = '#f42c5e'
        border_color = '#d31e52'
        geometries = (POLYGON, LINESTRING, POINT)
        categories = NeedCategory.categories
        form_view_name = 'new_need_from_map'
        form_view_kwargs = {}

    def __unicode__(self):
        return unicode(self.name)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        r_ = super(Need, self).save(*args, **kwargs)
        index_object_for_search.send(sender=self, obj=self)
        return r_

    image = "img/need.png"
    image_off = "img/need-off.png"
    default_logo_url = "img/logo-need.png"

    # Url aliases
    @property
    def home_url_params(self):
        return {'id': self.id}

    @property
    def view_url(self):
        return reverse('view_need', kwargs=self.home_url_params)

    @property
    def edit_url(self):
        return reverse('edit_need', kwargs=self.home_url_params)

    @property
    def admin_url(self):
        return reverse('admin:{}_{}_change'.format(self._meta.app_label,
            self._meta.module_name), args=[self.id])

    @property
    def title(self):
        return self.name

    @property
    def perm_id(self):
        return 'n%d' % self.id

    # ==========================================================================
    # Utils

    # def from_dict(self, data):
    #     keys = ['id', 'name', 'contact', 'geojson',  'creation_date',
    #             'is_admin', 'is_active', 'about_me']
    #     date_keys = ['creation_date']
    #     build_obj_from_dict(self, data, keys, date_keys)

    def to_dict(self):
        fields_and_defaults = [
            ('name', None), ('slug', None), ('description', None),
            ('short_description ', None),
            ('creator_id', None), ('creation_date', None),
            ('last_editor_id', None), ('last_update', None),
            ('geojson', {}), ('contacts', {}),
        ]
        dict_ = {v[0]: getattr(self, v[0], v[1]) for v in fields_and_defaults}
        dict_['tags'] = [tag.name for tag in self.tags.all()]
        dict_['target_audiences'] = [ta.name for ta in self.target_audiences.all()]
        dict_['categories'] = [cat.id for cat in self.categories.all()]
        return dict_

    # def is_valid(self, ignore=[]):
    #     self.errors = {}
    #     valid = True
    #     return valid
