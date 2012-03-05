from devilry.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi

from trix.apps.trix.simplified import SimplifiedNode
from manager import trix_manager
from authorization import AuthorizationMixin

@trix_manager.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedNode(AuthorizationMixin):
    class Meta:
        simplified = SimplifiedNode

    class ExtjsModelMeta:
        combobox_displayfield = 'short_name'
        combobox_tpl = ('<div class="section popuplistitem">'
                        '    <h1>{long_name}</h1>'
                        '</div>')
