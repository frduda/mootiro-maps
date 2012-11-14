# -*- coding: utf8 -*-
from __future__ import unicode_literals

from authentication.models import User
from apps.organization.models import Organization
from resources.models import Resource

from .base import Interpreter


class OrganizationInterpreter(Interpreter):
    '''
    A model of this worksheet is public available in:
    https://docs.google.com/spreadsheet/ccc?key=
    '''
    header_rows = 2
    # TODO: change this name
    worksheet_name = 'organization'
    
    def a_better_row_dict(self, row_dict):
        '''Reorganize a row_dict to something better.'''
        rd = row_dict
        d = {}

        # Controle
        d['id'] = rd['Controle']['ID']
        d['type'] = {
            'organização': Organization,
            'recurso': Resource,
        }[rd['Controle']['Tipo'].lower()]
        try:
            d['creator'] = User.objects.get(name=rd['Controle']['Nome do mapeador'])
        except:
            d['creator'] = None

        # Nome
        if rd['Nome']['Sigla'] and rd['Nome']['Nome da organização']:
            d['name'] = '{} - {}'.format(rd['Nome']['Sigla'],
                                    rd['Nome']['Nome da organização'])
        elif rd['Nome']['Sigla'] or rd['Nome']['Nome da organização']:
            d['name'] = rd['Nome']['Sigla'] or rd['Nome']['Nome da organização']
        else:
            d['name'] = None

        # Contato
        pass

        # Description
        d['description'] = ''
        for title, text in rd['Descrição'].items():
            if not text:
                continue
            d['description'] += \
'''
####{title}

{text}

'''.format(title=title, text=text)

        return d

    def validate_row_dict(self, better_row_dict):
        d = better_row_dict

        o = d['type'].from_dict(d)
        if o.is_valid():
            e = {}
        else:
            e = o.errors
        w = {}

        # Duplicates
        # TODO: inexact title search
        # TODO: use georef to enhance matches
        q = d['type'].objects.filter(name=d['name'])
        if q.exists():
            w['duplicates'] = []
            for obj in q:
                w['duplicates'].append(obj)

        return {'object': o, 'warnings': w, 'errors': e}
