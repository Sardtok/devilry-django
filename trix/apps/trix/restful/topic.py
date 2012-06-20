from devilry.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi

from trix.apps.trix.simplified import SimplifiedTopic
from manager import trix_manager
from authorization import AuthorizationMixin

@trix_manager.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedTopic(AuthorizationMixin):
    class Meta:
        simplified = SimplifiedTopic

    class ExtjsModelMeta:
        combobox_displayfield = 'name'
        combobox_tpl = ('<div class="section popuplistitem"><h1>{name}</h1></div>')
