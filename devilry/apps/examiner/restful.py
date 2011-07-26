from ...restful import restful_modelapi, ModelRestfulView, RestfulManager
from ..extjshelpers import extjs_restful_modelapi
from simplified import (SimplifiedSubject, SimplifiedPeriod,
                        SimplifiedAssignment, SimplifiedAssignmentGroup,
                        SimplifiedDelivery, SimplifiedDeadline,
                        SimplifiedStaticFeedback, SimplifiedFileMeta)
from devilry.coreutils.restful import metabases as restfulmetabases


__all__ = ('RestfulSimplifiedSubject',
           'RestfulSimplifiedPeriod', 'RestfulSimplifiedAssignment',
           'RestfulSimplifiedAssignmentGroup', 'RestfulSimplifiedDelivery',
           'RestfulSimplifiedDeadline', 'RestfulSimplifiedFileMeta',
           'RestfulSimplifiedStaticFeedback')


examiner_restful = RestfulManager()


@examiner_restful.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedSubject(ModelRestfulView):
    class Meta:
        simplified = SimplifiedSubject


@examiner_restful.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedPeriod(ModelRestfulView):
    class Meta:
        simplified = SimplifiedPeriod
        foreignkey_fields = {'parentnode': RestfulSimplifiedSubject}


@examiner_restful.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedAssignment(ModelRestfulView):
    class Meta:
        simplified = SimplifiedAssignment
        foreignkey_fields = {'parentnode': RestfulSimplifiedPeriod}

    class ExtjsModelMeta(restfulmetabases.AssignmentExtjsModelMeta):
        """ Metadata for javascript. """


@examiner_restful.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedAssignmentGroup(ModelRestfulView):
    class Meta:
        simplified = SimplifiedAssignmentGroup
        foreignkey_fields = {'parentnode': RestfulSimplifiedAssignment}

    class ExtjsModelMeta(restfulmetabases.AssignmentGroupExtjsModelMeta):
        """ Metadata for javascript. """


@examiner_restful.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedDeadline(ModelRestfulView):
    class Meta:
        simplified = SimplifiedDeadline
        foreignkey_fields = {'parentnode': RestfulSimplifiedAssignmentGroup}

    class ExtjsModelMeta(restfulmetabases.DeadlineExtjsModelMeta):
        """ Metadata for javascript. """


@examiner_restful.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedDelivery(ModelRestfulView):
    class Meta:
        simplified = SimplifiedDelivery
        foreignkey_fields = {'parentnode': RestfulSimplifiedAssignmentGroup}

    class ExtjsModelMeta(restfulmetabases.DeliveryExtjsModelMeta):
        """ Metadata for javascript. """


@examiner_restful.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedStaticFeedback(ModelRestfulView):
    class Meta:
        simplified = SimplifiedStaticFeedback
        foreignkey_fields = {'parentnode': RestfulSimplifiedDelivery}


@examiner_restful.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedFileMeta(ModelRestfulView):
    class Meta:
        simplified = SimplifiedFileMeta
        foreignkey_fields = {'parentnode': RestfulSimplifiedDelivery}
