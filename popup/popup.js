var token = "";
var mess;
var arr = [];
var map= [];
var ans =0 ;
$.get("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed", function(data, status){
        if(data[0] == '<'){
            flag = true;
            $('#message').html('Oops! Lỗi, hãy đăng nhập vào http://facebook.com và mở lại tiện ích');
            // $('#intro').remove();
        }
        else{
            var myRe = /(?<=accessToken\\":\\")(.*?)(?=\\",\\")/gmu;
            var myArray = myRe.exec(data);
            token = myArray[0];
            var Re2 = /(?<=name=\\"fb_dtsg\\" value=\\")(.*?)(?=\\")/gmu;
            fbDstg = Re2.exec(data)[0];
            chrome.storage.local.get(['receivedMessages', 'removedMessages', 'lastPurgeTime'], function(result) {
                if(typeof result.removedMessages == "undefined" || result.removedMessages=="{}"){$('#load').hide();return;}
                // console.log(result.removedMessages);
                mess = JSON.parse(result.removedMessages);
                var dataKey = (Object.keys(mess));
                arr = [];
                map = [];
                dataKey.forEach((val)=>{
                    var removeMess = mess[val];
                    var messDetail = removeMess.body;
                    var type = removeMess.thread_id.split(":")[0];
                    var id = removeMess.author.split(":")[1];
                    var d = new Date(removeMess.timestamp);
                    var time = d.toLocaleString();
                    $.get("https://graph.facebook.com/"+id+"?access_token="+token, function(data, status){
                        if(removeMess.has_attachment !='') {
                            if(removeMess.attachments[0].attach_type == 'photo')
                                map[removeMess.timestamp] = ' <h3> <a href="https://www.facebook.com/'+id+'" target="_blank">'+data.name+'</a> :  '+messDetail+' <a target="_blank" class="attach" href="'+removeMess.attachments[0].large_preview_url+'">Attachment (type: '+removeMess.attachments[0].attach_type+')</a> (gửi vào lúc '+time+')  </h3> <hr>';
                            
                            if(removeMess.attachments[0].attach_type == 'sticker' || removeMess.attachments[0].attach_type == "video" || removeMess.attachments[0].attach_type == "file")
                                map[removeMess.timestamp] = ' <h3> <a href="https://www.facebook.com/'+id+'" target="_blank">'+data.name+'</a> :  '+messDetail+' <a target="_blank" class="attach" href="'+removeMess.attachments[0].url+'">Attachment (type: '+removeMess.attachments[0].attach_type+')</a> (gửi vào lúc '+time+')  </h3> <hr>';
                            if(removeMess.attachments[0].attach_type == 'share')
                                map[removeMess.timestamp] = ' <h3> <a href="https://www.facebook.com/'+id+'" target="_blank">'+data.name+'</a> :  '+messDetail+' <a target="_blank" class="attach" href="'+removeMess.attachments[0].share.uri+'">Attachment (type: Link)</a> (gửi vào lúc '+time+')  </h3> <hr>';

                        }
                        else map[removeMess.timestamp] = ' <h3> <a href="https://www.facebook.com/'+id+'" target="_blank">'+data.name+'</a> :  '+messDetail+' (gửi vào lúc '+time+')  </h3> <hr> ';
                        arr.push(removeMess.timestamp);
                        ans++;
                    });
                    
                });
                var chay = setInterval(()=>{
                        if(ans >= dataKey.length){
                            $('#load').hide();
                            arr.sort();
                            $('#app').html('');
                            for(let i = arr.length - 1;i>=0;i--){   
                                $('#app').append(map[arr[i]]);
                            }
                            clearInterval(chay);
                        }
                         
                },100);
            });
        }
});
$('#intro').click(()=>{
    alert('Để tránh bị lỗi nhớ f5 lại các trang Messenger, Facebook nhé :))  ');
    chrome.storage.local.set({'removedMessages': "{}"});
    chrome.storage.local.set({'lastPurgeTime': "{}"});
    chrome.storage.local.set({'removedMessages': "{}"});
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {reset: true}, function(response) {
        // console.log(response.farewell);
        return true;
      });
      return true;
});
    $('#app').html('');
});