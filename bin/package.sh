#!/bin/bash

project_path = $0
code = $1
package_name = $2


cd $project_path && tar cvf "patch_#{$package_name}.tar" $code 
cd $project_path && tar cvf "sh_#{$package_name}.tar" ./script 
cd $project_path && tar cvf "#{$package_name}.tar" "./patch_#{$package_name}.tar" "./sh_#{$package_name}.tar"
