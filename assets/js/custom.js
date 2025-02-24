$(document).ready(function() {
    var init = function() {
        jQuery("html,body").animate({ scrollTop: 0 }, 'slow');
        $("input:text:visible:first").focus();

        var currentWidth = $("#nav-1")
            .find("li:nth-of-type(2) a")
            .parent("li")
            .width();
        var currentheight = $("#nav-1")
            .find("li:nth-of-type(2) a")
            .parent("li")
            .height();
        var current = $("li:nth-of-type(2) a").position();
        if (current['left'] == 10) {
            $('#prev').prop('disabled', true);
            $('#prev').addClass('btn-disable');
            $("#nav-1 .slide1").css({
                left: +current.left,
                width: currentWidth - 5,
                height: currentheight
            });
        } else {
            $("#nav-1 .slide1").css({
                left: +current.left,
                width: currentWidth,
                height: currentheight
            });
        }

        $('#nav-1 li').on('click', function(evt) {
            evt.preventDefault();
            return false;
        });

        $('#btn_prev').prop('disabled', true);
    };
    init();

    var g_stage = 0;

    $('#btn_next').on("click", function() {
        var form_data = new FormData($('#reservForm')[0]);
        var inputNameGanji = $('#first_name');
        var inputNameKana = $('#second_name');
        var inputEmail = $('#email_address');
        var inputPlace = $('#reserve_place');
        var Email = inputEmail.val();
        if(Email) {
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test(Email)){
               $('#email_error').css('display', 'block');
               return;
            } 
        }

        switch (g_stage) {
            case 0:
                if (inputNameGanji.val() && inputNameKana.val() && inputPlace.val() && form_data.has('time[]')) {
                    g_stage++;
                    // hide all err-msgs
                    jQuery("html,body").animate({ scrollTop: 300 }, 'slow');
                    $('#reservForm #field_error').css('display', 'none');
                    //show message input field confirm 
                    $('#reservForm #confirm-field').css('display', 'block');
                    //continue hide all err-msgs
                    $('#first_name_error').css('display', 'none');
                    $('#second_name_error').css('display', 'none');
                    $('#email_error').css('display', 'none');
                    $('#time_error').css('display', 'none');
                    // make inputs disabled
                    inputNameGanji.prop('disabled', true);
                    inputNameKana.prop('disabled', true);
                    inputEmail.prop('disabled', true);
                    inputPlace.prop('disabled', true);
                    $('#time_field input[type=checkbox]').prop('disabled', true);
                    // hide `必須` labels
                    $('.inquiryForm-requiredLabel').css('display', 'none');
                    // change button caption
                    $('#btn_next').val('申し込み');
                    $('#btn_prev').prop('disabled', false);
                    // move bubble label
                    var _current = $("li:nth-of-type(3) a").position();
                    $("#nav-1 .slide1").css({
                        left: +_current.left
                    });
                } else {
                    jQuery("html,body").animate({ scrollTop: 0 }, 'slow');
                    $('#reservForm #field_error').css('display', 'block');
                    if (!inputNameGanji.val()) {
                        $('#first_name_error').css('display', 'block');
                    } else {
                        $('#first_name_error').css('display', 'none');
                    }
                    if (!inputNameKana.val()) {
                        $('#second_name_error').css('display', 'block');
                    } else {
                        $('#second_name_error').css('display', 'none');
                    }
                    if (!inputPlace.val()) {
                        // hardly possible
                        $('#reserve_place').val('TVCMなどの広告を見て');
                    }
                    if (!form_data.has('time[]')) {
                        $('#time_error').css('display', 'block');
                    } else {
                        $('#time_error').css('display', 'none');
                    }
                }
                break;
            case 1:
                //loading spinner when data sending
                $('#reservForm .loading').css('display', 'block');
                jQuery("html,body").animate({ scrollTop: $(document).height() }, 'slow');
                $('#btn_prev').prop('disabled', true);
                $('#btn_next').prop('disabled', true);
                // get all input values
                // ajax post for sending mail
                var inputTime = [];
                var url = "./vendor/sendmail.php";
                var reply = "./vendor/replymail.php";
                $('input[name="time[]"]:checked').each(function() {
                    inputTime.push($(this).val());
                });
                $.ajax({
                    url: url,
                    type: "POST",
                    data: {
                        inputTime: inputTime.toString(),
                        inputNameGanji: inputNameGanji.val(),
                        inputNameKana: inputNameKana.val(),
                        inputPlace: inputPlace.val(),
                    },
                    success: function(res) {
                        $('#reservForm .loading').css('display', 'none');
                        $('#reservForm #confirm-field').css('display', 'none');
                        $('#btn_prev').prop('disabled', false);
                        $('#btn_next').prop('disabled', false);
                        var result = res.search("Message has been sent!");
                            if (result > 0) {
                            //// if sending mail is success
                            g_stage++;
                            var _current = $("li:nth-of-type(4) a").position();
                            $("#nav-1 .slide1").css({
                                left: +_current.left
                            });
                            $.post(reply, {email: Email});

                            $('#reservForm .field-list').css('display', 'none');
                            $('#reservForm .send-okay').css('display', 'block');
                            $('#btn_prev').css('display', 'none');
                            $('#btn_next').val('戻る');
                        } else {
                            //// if sending mail failed
                            $('#reservForm .loading').css('display', 'none');
                            $('#reservForm #confirm-field').css('display', 'none');
                            $('#btn_prev').prop('disabled', false);
                            $('#btn_next').prop('disabled', false);
                            window.alert('Failed to mail send!');
                        }

                    },
                    //// else if failure
                    error: function(err) {
                        console.log(err);
                        $('#reservForm .loading').css('display', 'none');
                        $('#reservForm #confirm-field').css('display', 'none');
                        $('#btn_prev').prop('disabled', false);
                        $('#btn_next').prop('disabled', false);
                        window.alert('Failed to mail send!');
                    }
                });

                break;
            case 2:
                window.location.reload();
                break;
            default:
                break;
        }

        return;
    });

    $("#btn_prev").on("click", function() {
        var inputNameGanji = $('#first_name');
        var inputNameKana = $('#second_name');
        var inputEmail = $('#email_address');
        var inputPlace = $('#reserve_place');

        switch (g_stage) {
            case 0:
                break;
            case 1:
                g_stage--;
                // make inputs re-enabled
                inputNameGanji.prop('disabled', false);
                inputNameKana.prop('disabled', false);
                inputEmail.prop('disabled', false);
                inputPlace.prop('disabled', false);
                $('#time_field input[type=checkbox]').prop('disabled', false);
                // move bubble label
                var _current = $("li:nth-of-type(2) a").position();
                $("#nav-1 .slide1").css({
                    left: +_current.left
                });
                // change button caption
                $('#btn_next').val('次へ');
                $('#btn_prev').prop('disabled', true);
                break;
            case 2:
                break;
            default:
                break;
        }
        return;
    });
});