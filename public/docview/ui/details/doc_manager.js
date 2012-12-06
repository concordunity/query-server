
// docIndex is 0-based. pageIndex is 1-based.
function DocManager() {
    var documents = new Array();
    var docIndex = 0;
    var pageIndex = 1;

    // nth is 1-based, docIndex is 0-based.
    this.getIndexedPage = function(docIndex, nth) {
	var ret = null;
	if (docIndex < this.documents.length) {
	    var numPages = this.documents[docIndex].pages.length;
		//console.log('======documents====');
		//console.log(this.documents[docIndex]);
	    var folder_id = this.documents[docIndex].folder_id;
	    if (nth > 0 && nth <= numPages) {
		ret = { docIndex: docIndex, page: nth};
	    } else if (nth == numPages + 1) {
		// Is there a next document?
		if (this.docIndex != (this.documents.length -1)) {
		    ret = { docIndex: docIndex + 1, page: 1 };
		}
	    } else if (nth == 0) {
		if (docIndex > 0) {
		    docIndex --;
		    var numPages = this.documents[docIndex].pages.length;
		    ret = { docIndex: docIndex, page: numPages, folder_id: folder_id }
		}
	    }
	}

	if (ret) {
	    this.docIndex = ret.docIndex;
	    this.pageIndex = ret.page;
	    var doc = this.documents[this.docIndex];

	    //console.log("========doc");
	    //console.log(ret);
	    //console.log(doc);
	    return {
		nthPage : ret.page,
		pageType: doc.getPageTypeFor(this.pageIndex),
		proposedPageType : doc.getProposedPageType(this.pageIndex),
		doc: doc,
		docIndex: this.docIndex,
		folder_id: folder_id,
		imagePath: doc.getImagePathFor(this.pageIndex)
	    };
	}
	return null;
    }
}


DocManager.prototype.updateCommentData = function(comment) {
    var doc = this.documents[this.docIndex];
    doc.addPageTypeComment(comment);
}

/**
 *   var docData = {
 *               label: label,
 *               pages: pages,
 *           directory: data.directory,
 *            metadata: metadata,
 *              groups: groups
 *        };
 */
DocManager.prototype.addDocument = function(docData) {
    this.documents.push(docData);
};

DocManager.prototype.clear = function() {
    this.documents = new Array();
    this.docIndex = 0;
    this.pageIndex = 1;
};

// Note: pageIndex is 1-based.
DocManager.prototype.gotoPage = function(docIndex, pageIndex) {
    return this.getIndexedPage(docIndex, pageIndex);
};

/**
 * Returns the page information along with the current document.
 */
DocManager.prototype.getCurrentPage = function() {
    return this.getIndexedPage(this.docIndex, this.pageIndex);
};

// Index is 0-based
DocManager.prototype.getNthDoc = function(index) {
    if (index <0 || index >= this.documents.length) {
	return null;
    }

    return this.documents[index];
}

/**
 * Returns the page information that should be displayed.
 */
DocManager.prototype.gotoNextPage = function() {
    return this.getIndexedPage(this.docIndex, this.pageIndex + 1);
};

DocManager.prototype.gotoPrevPage = function() {
    return this.getIndexedPage(this.docIndex, this.pageIndex - 1);
};

DocManager.prototype.getNumDocs = function() {
    return this.documents.length;
}



