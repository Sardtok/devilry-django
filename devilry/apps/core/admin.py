from models import (Node, Subject, Period, Assignment,
        AssignmentGroup, Candidate, Delivery, FileMeta, Feedback, Deadline)
from django.contrib import admin


class BaseNodeAdmin(admin.ModelAdmin):
    list_display = ('short_name', 'long_name', 'get_path', 'get_admins',
            'id')
    search_fields = ['short_name', 'long_name', 'admins__username', 'id']


class NodeAdmin(BaseNodeAdmin):
    pass


class SubjectAdmin(BaseNodeAdmin):
    search_fields = BaseNodeAdmin.search_fields + ['parentnode__short_name']


class PeriodAdmin(BaseNodeAdmin):
    list_display = ['parentnode', 'short_name', 'get_path',
            'start_time', 'end_time', 'get_admins', 'id']
    search_fields = BaseNodeAdmin.search_fields + ['parentnode__short_name']
    list_filter = ['start_time', 'end_time']
    ordering = ['parentnode']
    date_hierarchy = 'start_time'


class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['short_name', 'long_name', 'get_path', 'grade_plugin',
            'anonymous', 'id', 
            'publishing_time', 'get_admins']
    search_fields = ['id', 'short_name', 'long_name', 'parentnode__short_name',
            'parentnode__parentnode__short_name', 'admins__username']
    list_filter = ['publishing_time', 'anonymous']
    date_hierarchy = 'publishing_time'


class CandidateInline(admin.TabularInline):
    model = Candidate
    extra = 0

class DeadlineInline(admin.TabularInline):
    model = Deadline
    extra = 0

class AssignmentGroupAdmin(BaseNodeAdmin):
    list_display = ['get_students', 'get_examiners', 'parentnode', 'name', 'id']
    search_fields = [
            'id',
            'students__username',
            'examiners__username',
            'parentnode__short_name',
            'parentnode__parentnode__short_name',
            'parentnode__parentnode__parentnode__short_name']
    ordering = ['parentnode']
    inlines = [CandidateInline, DeadlineInline]



#class FeedbackAdmin(admin.ModelAdmin):
    #list_display = ['delivery', 'format', 'get_examiners',
            #'get_students', 'id']
    #list_filter = ['format']
    #search_fields = [
            #'id',
            #'delivery__assignment_group__students__username',
            #'delivery__assignment_group__examiners__username',
            #'delivery__assignment_group__parentnode__short_name',
            #'delivery__assignment_group__parentnode__parentnode__short_name',
            #'delivery__assignment_group__parentnode__parentnode__parentnode__short_name']

    #def get_students(self, feedback):
        #return feedback.delivery.assignment_group.get_students()
    #get_students.short_description = AssignmentGroup.get_students.short_description

    #def get_examiners(self, feedback):
        #return feedback.delivery.assignment_group.get_examiners()
    #get_examiners.short_description = AssignmentGroup.get_examiners.short_description



class FeedbackInline(admin.StackedInline):
    model = Feedback
    extra = 0


class FileMetaInline(admin.TabularInline):
    model = FileMeta
    extra = 0

class DeliveryAdmin(admin.ModelAdmin):
    list_display = ['assignment_group', 'get_examiners', 'time_of_delivery',
            'delivered_by', 'id']
    list_filter = ['successful', 'time_of_delivery']
    inlines = [FileMetaInline, FeedbackInline]
    search_fields = [
            'id',
            'assignment_group__students__username',
            'assignment_group__examiners__username',
            'assignment_group__parentnode__short_name',
            'assignment_group__parentnode__parentnode__short_name',
            'assignment_group__parentnode__parentnode__parentnode__short_name']
    date_hierarchy = 'time_of_delivery'

    def get_students(self, delivery):
        return delivery.assignment_group.get_students()
    get_students.short_description = AssignmentGroup.get_students.short_description

    def get_examiners(self, delivery):
        return delivery.assignment_group.get_examiners()
    get_examiners.short_description = AssignmentGroup.get_examiners.short_description


admin.site.register(Node, NodeAdmin)
admin.site.register(Subject, SubjectAdmin)
admin.site.register(Period, PeriodAdmin)
admin.site.register(Assignment, AssignmentAdmin)
admin.site.register(AssignmentGroup, AssignmentGroupAdmin)
admin.site.register(Delivery, DeliveryAdmin)