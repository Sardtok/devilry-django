from devilry.apps.core import models
from devilry.simplified import FieldSpec, FilterSpec, FilterSpecs, ForeignFilterSpec



class SimplifiedDeliveryMetaMixin(object):
    """ Defines the django model to be used, resultfields returned by
    search and which fields can be used to search for a Delivery object
    using the Simplified API """
    model = models.Delivery
    resultfields = FieldSpec('id',
                             'number',
                             'time_of_delivery',
                             'deadline',
                             deadline=['deadline__assignment_group', 'deadline__deadline'],
                             assignment_group=['deadline__assignment_group',
                                               'deadline__assignment_group__name'],
                             assignment=['deadline__assignment_group__parentnode',
                                         'deadline__assignment_group__parentnode__short_name',
                                         'deadline__assignment_group__parentnode__long_name'],
                             period=['deadline__assignment_group__parentnode__parentnode',
                                     'deadline__assignment_group__parentnode__parentnode__short_name',
                                     'deadline__assignment_group__parentnode__parentnode__long_name'],
                             subject=['deadline__assignment_group__parentnode__parentnode__parentnode',
                                      'deadline__assignment_group__parentnode__parentnode__parentnode__short_name',
                                      'deadline__assignment_group__parentnode__parentnode__parentnode__long_name'])
    searchfields = FieldSpec('number',
                             # assignmentgroup
                             'deadline__assignment_group__name',
                             'deadline__assignment_group__examiners__username',
                             'deadline__assignment_group__candidates__identifier',
                             # assignment
                             'deadline__assignment_group__parentnode__short_name',
                             'deadline__assignment_group__parentnode__long_name',
                             # period
                             'deadline__assignment_group__parentnode__parentnode__short_name',
                             'deadline__assignment_group__parentnode__parentnode__long_name',
                             # subject
                             'deadline__assignment_group__parentnode__parentnode__parentnode__short_name',
                             'deadline__assignment_group__parentnode__parentnode__parentnode__long_name')
    filters = FilterSpecs(FilterSpec('id'),
                          FilterSpec('deadline'),
                          ForeignFilterSpec('deadline',
                                            FilterSpec('deadline'),
                                            FilterSpec('assignment_group')),
                          ForeignFilterSpec('deadline__assignment_group',  # AssignmentGroup
                                            FilterSpec('parentnode'),
                                            FilterSpec('name')),
                          ForeignFilterSpec('deadline__assignment_group__parentnode',  # Assignment
                                            FilterSpec('parentnode'),
                                            FilterSpec('short_name'),
                                            FilterSpec('long_name')),
                          ForeignFilterSpec('deadline__assignment_group__parentnode__parentnode',  # Period
                                            FilterSpec('parentnode'),
                                            FilterSpec('short_name'),
                                            FilterSpec('long_name')),
                          ForeignFilterSpec('deadline__assignment_group__parentnode__parentnode__parentnode',  # Subject
                                            FilterSpec('parentnode'),
                                            FilterSpec('short_name'),
                                            FilterSpec('long_name')))
