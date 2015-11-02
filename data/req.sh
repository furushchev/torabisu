curl -i -X GET \
-H 'Accept: application/vnd.travis-ci.2+json' \
-H 'User-Agent: MyClient/1.0.0' \
--data '{"token": "H3jJLd7x6Eejfv1FsUdD"}' \
https://api.travis-ci.org/repos/jsk-ros-pkg/jsk_demos/builds/88499467  | sed -e 's/}/}\n/g' | sed -e 's/,/,\n/g'
#--data '{"build_id": 88499467}' \
#-H 'Authorization: token H3jJLd7x6Eejfv1FsUdD' \
