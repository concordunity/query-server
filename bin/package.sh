#!/bin/bash

project_path = $0
code = $1
package_name = $2


cd $project_path && tar cvf "pactch_#{$package_name}" $code 
