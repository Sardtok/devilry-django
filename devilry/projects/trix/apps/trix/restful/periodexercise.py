from devilry.apps.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi

from ...simplified import SimplifiedPeriodExercise

class RestfulSimplifiedPeriodExercise(ModelRestfulView):
    class Meta:
        simplified = SimplifiedPeriodExercise

    class ExtjsModelMeta:
        
