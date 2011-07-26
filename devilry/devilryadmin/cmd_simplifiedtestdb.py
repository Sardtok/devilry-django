    #!/usr/bin/env python
# Create simplified test DB.

#################################################################
# WARNING: DO NOT CHANGE this file lightly. The resulting
# database is used to generate the simplifed fixture,
# which is used in many tests.
#################################################################

from sys import exit
from subprocess import call
from os.path import join

from common import (getscriptsdir, require_djangoproject,
                    append_pythonexec_to_command, depends, Command,
                    DevilryAdmArgumentParser)



parser = DevilryAdmArgumentParser(description='Process some integers.')
parser.add_argument('-s', '--numstudents', type=int, default=2,
                    help='Number of students on each assignment (defaults to 2).')
parser.add_argument('-e', '--numexaminers', type=int, default=1,
                    help='Number of examiners on each assignment (defaults to 1).')
parser.add_argument('-d', '--duckburghusers', action='store_true',
                    help='Load duckburgh users.')
parser.add_argument("--deliverycountrange", default='0-4',
                    help=("Number of deliveries. If it is a range separated by '-', "
                          "a random number of deliveries in this range is used. Defaults "
                          "to '0-4'"))
parser.add_argument('--completionlist', action='store_true',
                   help='Print completionlist for bash completion.')
args = parser.parse_args()

if args.completionlist:
    print "--numstudents --numexaminers --duckburghusers --deliverycountrange"
    exit(0)


require_djangoproject()
depends(Command('init_exampledb'),
        Command('load_grandmauser'),
        Command('load_duckburghusers'))
if args.duckburghusers:
    depends(Command('load_duckburghusers'))






scriptsdir = getscriptsdir()
create_testgroups_cmd = join(scriptsdir, 'create_testgroups.py')

def create_testgroups(path, numstudents, numexaminers, subject_long_name,
                      period_long_name, deliverycountrange, assignments,
                      examinerspergroup=1, studentspergroup=1):
    for a in assignments:
        args = [create_testgroups_cmd,
                '{0}.{1}'.format(path, a['shortname']),
                '--grade-plugin', 'fake',
                '--num-students', str(numstudents),
                '--num-examiners', str(numexaminers),
                '--deadline-profile', str(a['deadlineprofile']),
                '--subject-long-name', subject_long_name,
                '--period-long-name', period_long_name,
                '--examiners-per-group', str(examinerspergroup),
                '--students-per-group', str(studentspergroup),
                '--assignment-long-name', a['long_name']]
        if 'maxpoints' in a:
            args.extend(['--grade-maxpoints', str(a['maxpoints'])])
        if 'pointscale' in a:
            args.extend(['--pointscale', str(a['pointscale'])])
        if deliverycountrange:
            args.extend(['--deliverycountrange', deliverycountrange])
        #print "args: ", args
        call(append_pythonexec_to_command(args))



# Duck 1100
create_testgroups(path = 'duckburgh.univ:duck1100.spring01',
                  numstudents = args.numstudents, numexaminers = args.numexaminers,
                  subject_long_name = 'DUCK1100 - Getting started with python',
                  period_long_name = 'Spring year zero',
                  deliverycountrange=args.deliverycountrange,
                  assignments = [
                                 {'shortname': 'week1', 'deadlineprofile': '-30', 'maxpoints': 14,
                                  'long_name': 'The one and only week one'},
                                 {'shortname': 'week2', 'deadlineprofile': '-20', 'maxpoints': 10,
                                  'long_name': 'The one and only week two'},
                                 {'shortname': 'week3', 'deadlineprofile': 'old', 'maxpoints': 9,
                                  'long_name': 'The one and only week tree'},
                                 {'shortname': 'week4', 'deadlineprofile': 'recent', 'maxpoints': 9,
                                  'long_name': 'The one and only week tree'},
                                ])

# Duck 1080
create_testgroups(path = 'duckburgh.univ:duck1080.fall01',
                  numstudents = args.numstudents, numexaminers = args.numexaminers,
                  subject_long_name = 'DUCK1080 - Making the illogical seem logical',
                  period_long_name = 'Fall year zero',
                  deliverycountrange=args.deliverycountrange,
                  assignments = [
                                 {'shortname': 'week1', 'deadlineprofile': '-30', 'maxpoints': 11,
                                  'pointscale': 10,
                                  'long_name': 'The one and only week one'},
                                 {'shortname': 'week2', 'deadlineprofile': '-20', 'maxpoints': 10,
                                  'pointscale': 10,
                                  'long_name': 'The one and only week two'},
                                 {'shortname': 'week3', 'deadlineprofile': 'recent', 'maxpoints': 9,
                                  'pointscale': 10,
                                  'long_name': 'The one and only week tree'},
                                ])

# Duck 3580
create_testgroups(path = 'duckburgh.univ:duck3580.fall01',
                  numstudents = args.numstudents, numexaminers = args.numexaminers,
                  subject_long_name = 'DUCK3580 - Making the web work',
                  period_long_name = 'Fall year zero',
                  deliverycountrange=args.deliverycountrange,
                  assignments = [
                                 {'shortname': 'week1', 'deadlineprofile': '-30',
                                  'gradeplugin': 'grade_approved:approvedgrade',
                                  'long_name': 'Week one'},
                                 {'shortname': 'week2', 'deadlineprofile': 'recent',
                                  'long_name': 'Week two'}
                                ])

# Duck 5063
create_testgroups(path = 'duckburgh.univ:duck5063.fall01',
                  numstudents = args.numstudents, numexaminers = args.numexaminers,
                  subject_long_name = 'DUCK5063 - Make low level stuff',
                  period_long_name = 'Fall year zero',
                  deliverycountrange=args.deliverycountrange,
                  assignments = [
                                 {'shortname': 'first_assignment', 'deadlineprofile': '-30',
                                  'gradeplugin': 'grade_approved:approvedgrade',
                                  'long_name': 'First assignment'},
                                 {'shortname': 'second_assignment', 'deadlineprofile': 'recent',
                                  'long_name': 'Second assignment'}
                                ],
                 studentspergroup = 2, examinerspergroup = 3)


print
print "**********************************************************"
print "Create an example database"
print
print "Log in as:"
print "     - grandma    (a superadmin)"
print "     - examiner0  (an examiner)"
print "     - student0   (a student)."
print
print "Every user has password: test"
print "**********************************************************"
