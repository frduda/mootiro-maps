var change_msg=function(e){$("#org-div-progress .alert").is(":hidden")&&$("#org-div-progress .alert").slideDown();var t=$("#org-div-progress .alert .msg");t.fadeOut("100",function(){t.html(e),t.fadeIn("100")})},change_percent=function(e){$("#org-div-progress .percent").html(e+"% "+gettext("complete"))},change_step=function(e){var t,n;for(var r=1;r<5;r++)$(".step_"+r).hide();$(".step_"+e).show(),t=Math.round(e*33.33-33.33),$(".progress .bar").css("width",""+t+"%"),e===1?($(".step_1_row_1").show(),$(".step_1_row_2").hide(),$(".step_1_row_3").hide()):e===4&&change_msg(gettext("Congratulations, you added an organization to MootiroMaps.")),change_percent(t),window.scrollTo(0,0)};$(function(){change_step(1),change_msg(gettext("Please, provide the organization's name so we can verify if it is already registered on our system.")),$("a.close").click(function(){$(this).parent().slideUp()}),$("#name_verify").click(function(){$.post("/organization/verify_name/",{org_name:$("#id_org_name_autocomplete").val()},function(e){var t,n;e.exists?(change_msg(gettext("This organization already exists. Do you want to add a branch?")),$(".step_1_row_1").hide(),$(".step_1_row_2").show(),$("#form_branch #id_branch_organization").val(e.id),$("#btn_concluir").attr("id",e.id)):(change_msg(gettext("This organization is not registered yet. Do you want to add this organization?")),$(".step_1_row_1").hide(),$(".step_1_row_3").show())},"json")}),$("#btn_add_filial").click(function(){change_step(3),change_msg(gettext("Enter with the data from the branch you have marked on map"));var e=$("#id_org_name_autocomplete").val();$("#id_filial_org_name").val(e)}),$("#btn_add_org").click(function(){change_step(2),change_msg(gettext("Enter with the data from the Organization which owns the branch you have marked on map."));var e=$("#id_org_name_autocomplete").val();$("#form_organization #id_name").val(e),$("#id_filial_org_name").val(e)}),$(".step_1_cancel").click(function(){change_step(1),change_msg(gettext("Please, provide the organization's name so we can verify if it is already registered on our system."))}),$("#btn_concluir").click(function(){var e=$(this).attr("id");url=dutils.urls.resolve("view_organization",{id:e}),window.location.pathname=url}),$("#form_organization").ajaxform({onSuccess:function(e){change_step(3),change_msg(gettext("Congratulations, your organization was successfully saved. Please, now add the data about the branch that you marked on the map.")),$("#form_branch #id_branch_organization").val(e.obj.id),$("#id_filial_org_name").val(e.obj.name),$("#btn_concluir").attr("id",e.obj.id)}}),$("#form_branch").ajaxform({onSuccess:function(e){change_step(4)}}),$("#form_organization").komooFormHintBoxes({name:{hint:gettext("Please insert a name for the organization")},description:{top:"45%",hint:gettext("What do you know about this organization? What are its services or products offered to the city or your community? Who is a partner of this organization? What is it known for?")},community:{hint:gettext("Please, inform the communities that are served by this organization. A community must have been registered previously on MootiroMaps."),top:"-8px"},link:{hint:gettext("Inform the website address of this organization "),top:"-15px"},contact:{hint:gettext("Insert the contact information of this organization (postal address, contact persons, phone number, email address)."),top:"25%"},target_audiences:{hint:gettext("Which people or groups are attended by this organization?"),top:"-12px"},categories:{hint:gettext("Please, select the categories that most reflect the organization's activities or cause."),top:"45%"},tags:{hint:gettext("Please, insert tags for your organizations. Tags are used for searching content on MootiroMaps. Precise tags will help others to find your content."),top:"-12px"},files:{hint:gettext("Please, upload photos of the organization or link to photos on Wiki Commons or Flickr. Make sure that the photos is licensed under creative commons."),top:"40%"},logo:{hint:gettext("Here you can upload the logo of the organization or use one of the category images. "),top:"-40px"}}),$("#form_branch").komooFormHintBoxes({branch_name:{hint:gettext("Please, insert a name for the affiliated organization."),top:"-8px"},branch_info:{top:"40%",hint:gettext("Please insert information about the affiliated organization, for example: what is its role? infrastructure? objectives? contact persons?")}})});