1
0查获的重点查验企业
zero_find_check_info
经营单位编号	经营单位名称	进出口报关单数	进出口查验数	进出口查验率	报关单编号	进出口	查验处理结果	报关关别	日期  是否存在单证  申报关区
business_units_number operating_name number_import_export_declarations number_import_export_inspection import_export_inspection_rate declarations_number import_export examination_handling_results declaration_customs date_value exists_in_system org_applied

rails g scaffold zero_find_check_info business_units_number:string operating_name:string number_import_export_declarations:integer number_import_export_inspection:integer import_export_inspection_rate:float declarations_number:string import_export:string examination_handling_results:string declaration_customs:string date_value:datetime  exists_in_system:boolean org_applied:string
临时表
rails g model temporary_zero business_units_number:string operating_name:string number_import_export_declarations:integer number_import_export_inspection:integer import_export_inspection_rate:float declarations_number:string import_export:string examination_handling_results:string declaration_customs:string date_value:datetime  exists_in_system:boolean org_applied:string
rails destroy model temporary_zero
2
一般贸易进口价格偏低报关记录
normal_import_price_less_record
日期 	报关单编号	商品编号	商品序号	美元值	第一(法定)数量	价格	实际价格上限	实际价格下限	全国均价  是否存在单证  申报关区
date_value declarations_number product_code product_number dollar_value first_legal_quantity price actual_price_cap actual_price_floor national_average_price exists_in_system org_applied
rails g scaffold normal_import_price_less_record date_value:datetime declarations_number:string product_code:string product_number:integer  dollar_value:integer first_legal_quantity:integer price:float actual_price_cap:float actual_price_floor:float national_average_price:float exists_in_system:boolean org_applied:string
临时表
temporary
rails g model temporary_normal date_value:datetime declarations_number:string product_code:string product_number:integer  dollar_value:integer first_legal_quantity:integer price:float actual_price_cap:float actual_price_floor:float national_average_price:float exists_in_system:boolean org_applied:string
rails destroy model temporary_normal
3
进口通关最长时间报关单
import_most_time_org_doc_info
报关单编号	运输方式	放行时间	接受申报时间	整体通关时间(小时)	报关关别代码	报关关别   是否存在单证  申报关区
declarations_number mode_transport release_time accept_declaration_time overall_operating_hours_hours declaration_customs_code declaration_customs exists_in_system org_applied

rails g scaffold import_most_time_org_doc_info declarations_number:string mode_transport:string release_time:datetime accept_declaration_time:datetime overall_operating_hours_hours:float declaration_customs_code:string declaration_customs:string exists_in_system:boolean org_applied:string
临时表
temporary
rails g model temporary_import declarations_number:string mode_transport:string release_time:datetime accept_declaration_time:datetime overall_operating_hours_hours:float declaration_customs_code:string declaration_customs:string exists_in_system:boolean org_applied:string
rails destroy model temporary_import

######################################################################################################################################################
dictionary字典表
编号	名称		类别
dic_num	dic_name	dic_type
rails g model dictionary_info dic_num:string dic_name:string dic_type:string

######################################################################################################################################################

sys_log
编号	名称		类别
user_id
role_id
user_name
role_name
action
describe


query_doctype_log
编号	名称		类别
user_id
role_id
doc_id
org
doc_type
ip
print
email
user_name
role_name
action
describe
status

######################################################################################################################################################
requisition
######################################################################################################################################################
申请人员 申请日期 科室名称 联系电话 审批人员 审批时间 登记人员 登记时间 核销人员 核销时间 终结说明 状态	关区号
######################################################################################################################################################
rails g model requisition apply_staff:string date_application:datetime department_name:string tel:integer approving_officer:string approval_time:datetime registration_staff:string check_in_timei:datetime write_off_staff:string write_off_time:datetime termination_instructions:string status:integer org:integer
######################################################################################################################################################
requisition_detail
######################################################################################################################################################
申请单序号 单证号 修改的随附单证 所在页码 借出事由	关区号
######################################################################################################################################################
rails g model requisition_detail requisition_id:integer single_card_number:string modify_accompanying_documents:string where_page:integer lent_reasons:string org:integer
######################################################################################################################################################
scene_lent_paper_document
######################################################################################################################################################
值	名称
######################################################################################################################################################
1	等待审批
2	审批通过，等待登记
3	完成登记
11	审批不通过
12	登记不通过
13	核销不通过
20	正常完成

