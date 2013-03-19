/**
 * --------------------------------------------------------------------
 * jQuery customfileinput plugin
 * Author: Scott Jehl, scott@filamentgroup.com
 * Copyright (c) 2009 Filament Group
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * Francis Fussiger - 2013 - Some bug fixes for IE and new features
 * --------------------------------------------------------------------
 */
$.fn.customFileInput = function(){
    //apply events and styles for file input element
    var fileInput = $(this)
    .addClass('customfile-input') //add class for CSS
    .mouseover(function(){
        upload.addClass('customfile-hover');
    })
    .mouseout(function(){
        upload.removeClass('customfile-hover');
    })
    .focus(function(){
        upload.addClass('customfile-focus');       
    })
    .blur(function(){
        upload.removeClass('customfile-focus');
    })
    .bind('disable',function(){
        fileInput.attr('disabled',true);
        upload.addClass('customfile-disabled');
    })
    .bind('enable',function(){
        fileInput.removeAttr('disabled');
        upload.removeClass('customfile-disabled');
    })
    .bind('checkChange', function(){
        if(fileInput.val() && fileInput.val() != fileInput.data('val')){
            fileInput.trigger('change');
        }
    })
    .bind('change',function(){
        //get file name
        var fileName = $(this).val().split(/\\/).pop();
        var extension = $.trim(fileName.split('.').pop().toLowerCase());
        //get file extension
        var fileExt = 'customfile-ext-' + extension;


        if($(fileInput).attr('permittedtypes')){
            var alertmsg = true;
            var permittedtypes = $(fileInput).attr('permittedtypes').split(',')
            for(var i in permittedtypes){
                if(permittedtypes[i] == extension){
                    alertmsg = false
                }
            }
            if(alertmsg){
                if($(fileInput).attr('permittedtypes_txt')){
                    alert($(fileInput).attr('permittedtypes_txt')+": "+fileName);
                }
                $(fileInput).attr('value','');
                uploadButton.text($(fileInput).attr('search'));
                uploadFeedback.html($(fileInput).attr('message')).attr('');
                return false
            }
        }

        //update the feedback
        uploadFeedback
        .text(fileName) //set feedback text to filename
        .removeClass(uploadFeedback.data('fileExt') || '') //remove any existing file extension class
        .addClass(fileExt) //add file extension class
        .data('fileExt', fileExt) //store file extension for class removal on next change
        .addClass('customfile-feedback-populated'); //add class to show populated state
        //change text of button
        uploadButton.text($(fileInput).attr('change'));
    })
    .click(function(){ //for IE and Opera, make sure change fires after choosing a file, using an async callback
        fileInput.data('val', fileInput.val());
        setTimeout(function(){
            fileInput.trigger('checkChange');
        },100);
    });
    //if not exist set the defaults...
    if(!$(fileInput).attr('search')){
        $(fileInput).attr('search',"Search");
    }
    if(!$(fileInput).attr('message')){
        $(fileInput).attr('search',"No file selected...");
    }
    //create custom control container
    var upload = $('<div class="customfile"></div>');
    //create custom control button
    var uploadButton = $('<span class="customfile-button" aria-hidden="true">'+ $(fileInput).attr('search') +'</span>').appendTo(upload);
    //create custom control feedback
    var uploadFeedback = $('<span class="customfile-feedback" aria-hidden="true">'+ $(fileInput).attr('message') +'</span>').appendTo(upload);

    //match disabled state
    if(fileInput.is('[disabled]')){
        fileInput.trigger('disable');
    }
    uploadButton.parent().mousemove(function(){
        var me = $(this);
        fileInput.css({
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'width':$(me).css('width'),
            'height':$(me).css('height')
        });
    }).insertAfter(fileInput);

    //clicks over the element or over the button, will start the event of open file box
    uploadButton.click(function(){
        fileInput.trigger("click");
    }).mouseout(function(){
        upload.removeClass('customfile-hover');
    }).mouseover(function(){
        upload.addClass('customfile-hover');
    })
 
    fileInput.appendTo(upload);
    //return jQuery
    return $(this);
};