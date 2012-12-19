# -*- coding: utf-8 -*-

class CreateSpecialTypeDocs < ActiveRecord::Migration
  def change
    create_table :special_type_docs do |t|
      t.string :doc_name
      t.string :doc_code, :null => false

      t.timestamps
    end

    SpecialTypeDoc.create(:doc_name => "转账退税申请书", :doc_code => "A088")
    SpecialTypeDoc.create(:doc_name => "删改单出口", :doc_code => "A089")
    SpecialTypeDoc.create(:doc_name => "上海海关滞报金减免审批表", :doc_code => "A090")
    SpecialTypeDoc.create(:doc_name => "保证金保函退转审批单", :doc_code => "A091")
    SpecialTypeDoc.create(:doc_name => "税款担保退保审批单", :doc_code => "A092")
    SpecialTypeDoc.create(:doc_name => "税款担保转税审批单", :doc_code => "A093")
    SpecialTypeDoc.create(:doc_name => "进出口税款保证金延期申请书", :doc_code => "A094")
    SpecialTypeDoc.create(:doc_name => "退转保证金", :doc_code => "A095")
    SpecialTypeDoc.create(:doc_name => "补充单证", :doc_code => "A096")
    SpecialTypeDoc.create(:doc_name => "退补税单证", :doc_code => "A097")
    SpecialTypeDoc.create(:doc_name => "查验记录单", :doc_code => "A098")
    SpecialTypeDoc.create(:doc_name => "删改单单证", :doc_code => "A099")

  end
end
