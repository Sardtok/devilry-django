from devilry.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi

from trix.apps.trix.simplified import SimplifiedPeriod
from manager import trix_manager
from authorization import AuthorizationMixin

@trix_manager.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedPeriod(AuthorizationMixin):
    class Meta:
        simplified = SimplifiedPeriod

    class ExtjsModelMeta:
        combobox_displayfield = 'short_name'
        combobox_tpl = ('<div class="important">{short_name}</div>'
                        '<div class="unimportant">{long_name}</div>')
