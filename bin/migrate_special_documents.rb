
docs = SpecialDocument.all
docs.each { |d|
  m = ModifiedDocument.new
  m.doc_id = d.doc_id
  m.doc_type = d.doc_type
  m.edc_date = d.edc_date
  m.label = d.label
  m.pages = d.pages
  m.folder_id = d.folder_id
  m.serial_number = d.serial_number
  m.mtype = 0
  m.phase = d.phase
  m.org = '2225'
  m.org_applied = '2225'
  m.save
}
