#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

import simplejson
from datetime import datetime, timedelta

from django.db import models
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import pgettext

from komoo_resource.models import Resource
from proposal.models import Proposal


class Update(models.Model):
    """An update generated by users interactions with komoo."""

    # The lines below are intended to be a json list of strings
    _names = models.CharField(max_length=2048, null=False)
    # keys are either a slug, id (Resource), or number (Proposal)
    _keys = models.CharField(max_length=2048, null=False)
    _links = models.CharField(max_length=2048, null=False)
    _users = models.CharField(max_length=2048, null=False)
    _user_ids = models.CharField(max_length=2048, null=True)
    _communities_names = models.CharField(max_length=2048)
    _communities_slugs = models.CharField(max_length=2048)

    object_id = models.IntegerField(null=False, db_index=True)
    object_type = models.CharField(max_length=32, null=False, db_index=True)

    date = models.DateTimeField(auto_now=True)
    comments_count = models.IntegerField(null=True)

    # update type
    ADD = "A"
    EDIT = "E"
    INSERT = "I"
    DISCUSSION = "D"
    TYPES = {
        "A": "added",
        "E": "edited",
        "D": "discussed",
        "I": "inserted",
    }
    type = models.CharField(max_length=1, null=False, db_index=True,
            choices=tuple(TYPES.items()))

    # Ugly!!!!!11
    def get_object(self):
        if self.object_type == 'importsheet':
            from importsheet.models import Importsheet
            return Importsheet.objects.get(id=self.object_id)
        else:
            raise NotImplementedError("Not implemented for object_type = '{}'"\
                        .format(self.object_type))

    # TODO: refactor those methods below into a JsonField class
    @property
    def instances(self):
        names = simplejson.loads(self._names)
        keys = simplejson.loads(self._keys)
        links = simplejson.loads(self._links)
        return [dict(name=z[0], slug=z[1], link=z[2]) for z in zip(names, keys, links)]

    @instances.setter
    def instances(self, instances):
        self._names = simplejson.dumps([i.name for i in instances])
        keys = []
        for i in instances:
            if type(i) == Resource:
                key = i.id
            elif type(i) == Proposal:
                key = i.number
            else:
                key = i.slug
            keys.append(key)
        self._keys = simplejson.dumps(keys)
        self._links = simplejson.dumps([i.view_url for i in instances])

    @property
    def instance(self):
        return self.instances[0]

    @property
    def users(self):
        try:
            names = simplejson.loads(self._users)
            ids = simplejson.loads(self._user_ids) if self._user_ids \
                    else ['' for n in names]
            return [dict(name=z[0], id=z[1]) for z in zip(names, ids)]
        except:
            return []

    @users.setter
    def users(self, l):
        try:
            self._users = simplejson.dumps([user.name for user in l])
            self._user_ids = simplejson.dumps([user.id for user in l])
        except:
            # dont know what to do =/
            pass

    @property
    def user(self):
        return self.users[0]

    def push_user(self, u):
        try:
            names = simplejson.loads(self._users)
            ids = simplejson.loads(self._user_ids)
            names.insert(0, u.name)
            ids.insert(0, u.id)
            self._users = simplejson.dumps(names)
            self._user_ids = simplejson.dumps(ids)
        except:
            pass

    @property
    def communities(self):
        if not self._communities_names:
            return []
        names = simplejson.loads(self._communities_names)
        slugs = simplejson.loads(self._communities_slugs)
        return [dict(name=z[0], slug=z[1]) for z in zip(names, slugs)]

    @communities.setter
    def communities(self, l):
        self._communities_names = simplejson.dumps([c.name for c in l])
        self._communities_slugs = simplejson.dumps([c.slug for c in l])

    @classmethod
    def get_recent_for(cls, obj, type_, **timeparams):
        if not timeparams:
            timeparams = dict(days=1)
        time_ago = datetime.now() - timedelta(**timeparams)
        u = Update.objects.filter(object_id=obj.id, type=type_,
            object_type=obj._meta.verbose_name, date__gt=time_ago)
        return u[0] if u else None

    def __unicode__(self):
        return unicode(self.instance)

    @property
    def image(self):
        return "img/updates-page/{}-{}.png" \
                    .format(self.object_type, self.TYPES[self.type])

    @property
    def object_app_name(self):
        if self.object_type == 'resource':
            return 'komoo_resource'
        elif self.object_type == 'organizationbranch':
            return 'organization'
        elif self.object_type == 'importsheet':
            return 'project'
        else:
            return self.object_type

    @property
    def readable_type(self):
        key_str = "{0} {1}".format(self.object_type, self.TYPES[self.type])
        tr_dict = {
            "community added":     _("community added"),
            "community edited":    _("community edited"),
            "community discussed": _("community discussed"),

            "need added":     _("need added"),
            "need edited":    _("need edited"),
            "need discussed": _("need discussed"),

            "proposal added":     _("proposal added"),
            "proposal edited":    _("proposal edited"),
            "proposal discussed": _("proposal discussed"),

            "organization added":     _("organization added"),
            "organization edited":    _("organization edited"),
            "organization discussed": _("organization discussed"),

            "resource added":     _("resource added"),
            "resource edited":    _("resource edited"),
            "resource discussed": _("resource discussed"),

            "investment added":     _("investment added"),
            "investment edited":    _("investment edited"),
            "investment discussed": _("investment discussed"),

            "project added":     _("project added"),
            "project edited":    _("project edited"),
            "project discussed": _("project discussed"),

            "importsheet inserted": _("importsheet inserted"),

        }
        return tr_dict[key_str]


class News(models.Model):
    """A news update to be shown in frontpage."""

    class Meta:
        verbose_name = "news"
        verbose_name_plural = "news"

    title = models.CharField(max_length=256, null=True, blank=True)
    title_link = models.CharField(max_length=512, null=True, blank=True)
    description = models.CharField(max_length=512, null=True, blank=True)
    date = models.DateField(null=False)

    def __unicode__(self):
        return "{} on {}".format((self.title or self.description or "blank"),
                            self.date)


# How does this works? Isn't it a circular dependency???
import signals
