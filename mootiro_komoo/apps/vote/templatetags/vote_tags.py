# -*- coding:utf-8 -*-
from django import template
from django.contrib.contenttypes.models import ContentType
from ..models import Vote
register = template.Library()


@register.inclusion_tag('vote/vote_templatetag.html', takes_context=True)
def vote(context, content_object):
    """
    Templatetags for Votes. It works for any given content_object.
    usage:
        {% vote any_object %}
    """
    c = ContentType.objects.get_for_model(content_object)
    votes_queryset = Vote.get_votes_for(content_object)
    votes = {'up': votes_queryset.filter(like=True).count(),
             'down': votes_queryset.filter(like=False).count()}
    return dict(content_type=c.id, object_id=content_object.id, votes=votes)


@register.inclusion_tag('vote/vote_staticfiles.html', takes_context=True)
def vote_staticfiles(context):
    """Static files (javascript/css) for the votes templatetag"""
    return {}
