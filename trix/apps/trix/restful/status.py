from devilry.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi
from django.conf.urls.defaults import url

from trix.apps.trix.simplified import SimplifiedStatus
from manager import trix_manager
from authorization import AuthorizationMixin

@trix_manager.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedStatus(AuthorizationMixin):
    class Meta:
        simplified = SimplifiedStatus

    class ExtjsModelMeta:
        combobox_displayfield = 'name'
        combobox_tpl = ('<div class="important">{name}</div>')
