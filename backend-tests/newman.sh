#!/bin/bash

TIME=`date +%Y-%m-%d-%H-%M-%S`

# First pass of testing validate all the APIs
newman --collection Sprint_MSDP.json.postman_collection \
	--environment postman_tests/Sprint_Live_website.postman_environment \
	--global postman_tests/globals.postman_globals	\
	--requestTimeout 7000 \
	--html Report_$TIME.html \
	--noColor \
	--exitCode

# Second pass of testing validate get details for each phone specified
# in the data.csv file
newman --collection Sprint_MSDP.json.postman_collection \
	--environment postman_tests/Sprint_Live_website.postman_environment \
	--global postman_tests/globals.postman_globals	\
	--data data.csv \
	--folder 4-Shop_phones_details \
	--requestTimeout 7000 \
	--html Report_phones_details_$TIME.html \
	--noColor \
	--exitCode
