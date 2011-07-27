from datetime import datetime

from django.utils.formats import date_format
from django.utils.translation import ugettext as _
from django.db import models
from django.db.models import Q, Max

from deadline import Deadline
from filemeta import FileMeta
from ..models import AbstractIsAdmin, AbstractIsExaminer, AbstractIsCandidate, Node, AssignmentGroup
# TODO: Constraint: Can only be delivered by a person in the assignment group?
#                   Or maybe an administrator?
class Delivery(models.Model, AbstractIsAdmin, AbstractIsCandidate, AbstractIsExaminer):
    """ A class representing a given delivery from an `AssignmentGroup`_.

    .. attribute:: time_of_delivery

        A django.db.models.DateTimeField_ that holds the date and time the
        Delivery was uploaded.

    .. attribute:: deadline

       A django.db.models.ForeignKey_ pointing to the `Deadline`_ for this Delivery.

    .. attribute:: number

        A django.db.models.fields.PositiveIntegerField with the delivery-number
        within this assignment-group. This number is automatically
        incremented within each assignmentgroup, starting from 1. Must be
        unique within the assignment-group. Automatic incrementation is used
        if number is None when calling :meth:`save`.

    .. attribute:: delivered_by

        A django.db.models.ForeignKey_ pointing to the user that uploaded
        the Delivery

    .. attribute:: successful

        A django.db.models.BooleanField_ telling whether or not the Delivery
        was successfully uploaded.

    .. attribute:: after_deadline

        A django.db.models.BooleanField_ telling whether or not the Delivery
        was delived after deadline..

    .. attribute:: filemetas

        A set of :class:`filemetas <devilry.apps.core.models.FileMeta>` for this delivery.

    .. attribute:: feedbacks

       A set of :class:`feedbacks <devilry.apps.core.models.StaticFeedback>` on this delivery.

    .. attribute:: etag

       A DateTimeField containing the etag for this object.

    """
    status_mapping = (
        _("Not corrected"),
        _("Corrected"),
        _("Corrected, not published"),
        _("Corrected and published"),
    )
    status_mapping_student = (
        status_mapping[0],
        status_mapping[1],
        status_mapping[2],
        status_mapping[3],
    )
    NOT_CORRECTED = 0
    CORRECTED = 1
    CORRECTED_AND_PUBLISHED = 2
    CORRECTED_NOT_PUBLISHED = 3

    TYPE_ELECTRONIC = 0
    TYPE_NON_ELECTRONIC = 1
    TYPE_ALIAS = 2
    
    delivery_type = models.PositiveIntegerField(default=TYPE_ELECTRONIC,
            verbose_name = _("Type of deliveries"),
            help_text=_('This option controls if this assignment accepts only '
                        'electronic deliveries, or accepts other kinds as well.'))
    # Fields automatically 
    time_of_delivery = models.DateTimeField(auto_now_add=True,
                                           help_text=_('Holds the date and time the Delivery was uploaded.'))
    deadline = models.ForeignKey(Deadline, related_name='deliveries')
    number = models.PositiveIntegerField(
        help_text=_('The delivery-number within this assignment-group. This number is automatically '
                    'incremented within each AssignmentGroup, starting from 1. Always '
                    'unique within the assignment-group.'))
    # Fields set by user
    successful = models.BooleanField(blank=True, default=False,
                                    help_text=_('Has the delivery and all its files been uploaded successfully?'))
    delivered_by = models.ForeignKey("Candidate")

    # Only used when this is aliasing an earlier delivery, delivery_type == TYPE_ALIAS
    alias_delivery = models.OneToOneField("Delivery", blank=True, null=True)

    def _delivered_too_late(self):
        """ Compares the deadline and time of delivery.
        If time_of_delivery is greater than the deadline, return True.
        """
        return self.time_of_delivery > self.deadline.deadline
    after_deadline = property(_delivered_too_late)

    class Meta:
        app_label = 'core'
        verbose_name = _('Delivery')
        verbose_name_plural = _('Deliveries')
        ordering = ['-time_of_delivery']
        #unique_together = ('assignment_group', 'number')

    @classmethod
    def q_is_candidate(cls, user_obj):
        """
        Returns a django.models.Q object matching Deliveries where
        the given student is candidate.
        """
        return Q(deadline__assignment_group__candidates__student=user_obj)
    
    @classmethod
    def q_published(cls, old=True, active=True):
        now = datetime.now()
        q = Q(deadline__assignment_group__parentnode__publishing_time__lt = now)
        if not active:
            q &= ~Q(deadline__assignment_group__parentnode__parentnode__end_time__gte = now)
        if not old:
            q &= ~Q(deadline__assignment_group__parentnode__parentnode__end_time__lt = now)
        return q

    
    @classmethod
    def q_is_admin(cls, user_obj):
        return Q(deadline__assignment_group__parentnode__admins=user_obj) | \
                Q(deadline__assignment_group__parentnode__parentnode__admins=user_obj) | \
                Q(deadline__assignment_group__parentnode__parentnode__parentnode__admins=user_obj) | \
                Q(deadline__assignment_group__parentnode__parentnode__parentnode__parentnode__pk__in=Node._get_nodepks_where_isadmin(user_obj))

    @classmethod
    def q_is_examiner(cls, user_obj):
        return Q(deadline__assignment_group__examiners=user_obj)

    def add_file(self, filename, iterable_data):
        """ Add a file to the delivery.

        :param filename:
            A filename as defined in :class:`FileMeta`.
        :param iterable_data:
            A iterable yielding data that can be written to file using the
            write() method of a storage backend (byte strings).
        """
        filemeta = FileMeta()
        filemeta.delivery = self
        filemeta.filename = filename
        filemeta.size = 0
        filemeta.save()
        f = FileMeta.deliverystore.write_open(filemeta)
        filemeta.save()
        for data in iterable_data:
            f.write(data)
            filemeta.size += len(data)
        f.close()
        filemeta.save()
        return filemeta

    def get_status_number(self):
        """ Get the numeric status for this delivery.

        :return: The numeric status:
            :attr:`Delivery.NOT_CORRECTED`,
            :attr:`Delivery.CORRECTED_NOT_PUBLISHED` or
            :attr:`Delivery.CORRECTED_AND_PUBLISHED`.
        """
        if self.feedbacks.all().count() > 0:
            return Delivery.CORRECTED_AND_PUBLISHED
        else:
            #return Delivery.CORRECTED_NOT_PUBLISHED # TODO: Handle the fact that this info does not exist anymore.
            return Delivery.NOT_CORRECTED

    #TODO delete this?
    #def get_localized_status(self):
        #"""
        #Returns the current status string from
        #:attr:`AssignmentGroup.status_mapping`.
        #"""
        #status = self.get_status_number()
        #return status_mapping[status]

    #TODO delete this?
    #def get_localized_student_status(self):
        #"""
        #Returns the current status string from
        #:attr:`status_mapping_student`.
        #"""
        #status = self.get_status_number()
        #return status_mapping_student[status]

    #TODO delete this?
    #def get_status_cssclass(self):
        #""" Returns the css class for the current status from
        #:attr:`status_mapping_cssclass`. """
        #return status_mapping_cssclass[self.get_status_number()]

    #TODO delete this?
    #def get_status_student_cssclass(self):
        #""" Returns the css class for the current status from
        #:attr:`status_mapping_student_cssclass`. """
        #return status_mapping_student_cssclass[
                #self.get_status_number()]

    def _set_number(self):
        m = Delivery.objects.filter(deadline__assignment_group=self.deadline.assignment_group).aggregate(Max('number'))
        self.number = (m['number__max'] or 0) + 1

    def save(self, *args, **kwargs):
        """
        Set :attr:`number` automatically to one greater than what is was last and
        add the delivery to the latest deadline (see :meth:`AssignmentGroup.get_active_deadline`).
        """
        if self.id == None:
            self._set_number()
        super(Delivery, self).save(*args, **kwargs)

    def __unicode__(self):
        return u'%s - %s (%s)' % (self.deadline.assignment_group, self.number,
                date_format(self.time_of_delivery, "DATETIME_FORMAT"))


def update_deadline_and_assignmentgroup_status(delivery):
    delivery.deadline._update_status()
    delivery.deadline.save()
    delivery.deadline.assignment_group._update_status()
    delivery.deadline.assignment_group.save()

def delivery_update_assignmentgroup_status_handler(sender, **kwargs):
    delivery = kwargs['instance']
    update_deadline_and_assignmentgroup_status(delivery)

from django.db.models.signals import pre_delete, post_save
post_save.connect(delivery_update_assignmentgroup_status_handler,
        sender=Delivery)
