from devilry.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi

from trix.apps.trix.simplified import SimplifiedPeriodExercise
from period import RestfulSimplifiedPeriod
from exercise import RestfulSimplifiedExercise
from manager import trix_manager
from authorization import AuthorizationMixin

@trix_manager.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedPeriodExercise(AuthorizationMixin):
    class Meta:
        simplified = SimplifiedPeriodExercise
        foreignkey_fields = {'exercise': RestfulSimplifiedExercise,
                             'period': RestfulSimplifiedPeriod}

    class ExtjsModelMeta:
        combobox_displayfield = 'exercise__long_name'
        combobox_tpl = ('<div class="section popuplistitem">'
                        '    <p class="path">{period__long_name} - '
                        '    <tpl for="exercise__topics__name">{.}'
                        '    <tpl if="xindex &lt; xcound">-</tpl>'
                        '    </tpl>'
                        '    </p>'
                        '    <h1>{exercise__long_name}</h1>'
                        '</div>')
