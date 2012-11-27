# -*- coding: utf-8 -*-
class WebLink < ActiveRecord::Base
	WebLink.create(:name=>"aSystemUpload",:description=>"用户信息及权限上传",:menu1=>"system",:menu2=>"system_upload",:controller=>"upload_file",:action=>"system_upload")
end


