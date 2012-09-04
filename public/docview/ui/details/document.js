
/**
 * docInfo is the JSON response from the web service.
 * filters is empty or an array of filter values
 */
function Document(docInfo, filters) {
    var metadata = docInfo.doc_info;
    this.groups = new Array();
    
    this.directory = docInfo.directory;
    this.docId = metadata.doc_id;
    
    this.isSpecialDoc = (this.directory === '/docimages_mod');
    this.specialDoc = false;
    if (docInfo.special_doc_info) {
	this.specialDoc = true;
    }
    this.pages = new Array();
    var images = docInfo.image_info.T_blog;
    
    this.totalPages = images.length;

    this.label = docInfo.label;

    var subgroup = new Array();
    this.originalIndices = new Array();

    //console.log("filter is", filters);
    var doFiltering = (filters);
    var prevType = undefined;
    var prevGroupName = "";

    for (var i=0; i < this.totalPages; i++) {
	var pt = images[i].TCode;
	if (doFiltering && pt!=0 && $.inArray(pt, filters) < 0) {
            //console.log("passing page ... ", pt);
            continue;
        }
        if (prevType !== undefined && pt !== prevType) {
            // Push previous subgroup and type into groups
            this.groups.push({
                type: prevType,
                name: prevGroupName,
                pages: subgroup
            });
            subgroup = new Array();
        }
        subgroup.push(images[i].FN);
        this.pages.push(images[i].FN);
	this.originalIndices.push(i);
        if (images[i].BT) {
            subgroup.push(images[i].BT);
            this.pages.push(images[i].BT);
	    this.originalIndices.push(i);
        }
        prevType = pt;
        prevGroupName = images[i].T;
    }
    // Push our remaining subgroup into groups
    this.groups.push({
        type: prevType,
        name: prevGroupName,
        pages: subgroup
    });
}

Document.prototype.getThumbnailPaths = function() {
    var path = this.directory + "/" + this.docId + '/' + this.docId + '/thumb/t_';

    var ret = []
    for (i=0; i< this.pages.length; i++) {
	ret.push(path + this.pages[i])
    }
    return ret;
}

Document.prototype.getDocId = function() {
    return this.docId;
}
// index is 0-based.
Document.prototype.getImagePathFor = function(index) {
    if (index < 0) {
	return "";
    }
    return this.directory + "/" + this.docId + '/' + this.docId + '/' + this.pages[index -1];
}

Document.prototype.getLabel = function() {
    return this.label;
}

Document.prototype.getPageGroups = function() {
    return this.groups;
}

Document.prototype.getTotalPages = function () {
    return this.totalPages;
}

// Note: numImages may be different from the numPages
// because a filter is applied.
Document.prototype.getNumImages = function () {
    return this.pages.length;
}

// Given page index selection 0, 1, 2, .....
Document.prototype.getPrintUrl = function (base, pageSelection) {
    var url = base + "?doc_id=" + this.docId;
    if (this.isSpecialDoc) {
	url = url + "&mod=1";
    }

    if (pageSelection) {
	var idx = [];
	for (i=0; i<pageSelection.length; i++) {
	    idx.push(this.originalIndices[pageSelection[i]]);
	}
    	url = url + "&pages=" + idx.join(',');
    } else {
	if (this.getNumImages() < this.totalPages) {
	    // We need to get all the indices in
	    url = url + "&pages=" + this.originalIndices.join(',');
	}
    }
    return url;
    // get the original index.
    // get doc_id
    // get modified path
}

Document.prototype.printGroups = function () {
    var s= "";
    for (var i=0; i< this.groups.length; i++) {
	s += "\n" + i;
	s += " has pages: " + this.groups[i].pages.length;
    }
    return s;
}

Document.prototype.hasSpecialDoc = function () {
    return this.specialDoc;
}