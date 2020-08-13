var inRequest = false;

$(function () {

    $(document).on("change", "#permissao", function () {
        if ($(this).val() == "3") {

            $(".cliente-container").fadeIn(500);

        } else {
            $(".cliente-container").fadeOut(500);
            $(this).val();

        }
    });

    $("#btn-user-novo").on("click", function (e) {
        e.preventDefault();

        _DialogBox_ValidadeUsuario(); return false;

    })

    $(document).on("click", ".btn-remove-foto", function () {
        $('#preview').attr('src', 'img/default.jpg');
        $("#fotoUsuario").val('')

        $("#usuario-form").append($("<input type='hidden' name='fileRemoved' id='fileRemoved' value='removed'> "))

        $(this).text("Adicionar")
        $(this).removeClass('btn-remove-foto')
        $(this).addClass("btn-add-picture")
    })


    $('.mask-date').mask('00/00/0000', { clearIfNotMatch: true });
    $('.mask-phone').mask('(00) 0000-0000P', { clearIfNotMatch: true, 'translation': { P: { pattern: /[0-9]/, optional: true } } });
    $('.mask-cep').mask('00000-000', { reverse: true, clearIfNotMatch: true });
    $('.mask-cnpj').mask('00.000.000/0000-00', { reverse: true, clearIfNotMatch: true });
    $('.mask-numberonly').mask('0#');

    $(document).on("change", "#fotoUsuario", function () {
        let _this = $(this);
        let input = this;

        if (input.files[0].type == 'image/png' || input.files[0].type == 'image/jpeg' || input.files[0].type == 'image/jpg') {
        } else {
            toastr["error"]('Extensão inválida.');
            return false;
        }

        $("#fileRemoved").remove();

        var reader = new FileReader();
        reader.onload = function (e) {
            $('#preview').attr('src', e.target.result);

        }
        reader.readAsDataURL(input.files[0]);

        $(".btn-add-picture").text("Remover")
        $(".btn-add-picture").addClass('btn-remove-foto')
        $(".btn-remove-foto").removeClass('btn-add-picture')


    });

    $(document).on("click", ".btn-add-picture", function () {
        $(".box-img-cliente").trigger("click")
    });



});



function _DialogBox_ValidadeUsuario() {
    if (inRequest) {
        ShowLoading("Aguarde... Alterando dados do usuário.");
        return;
    }

    var formEle = $('#usuario-form');
    var postData = {};

    postData.id_usuario = $(formEle).find('input[name=id_usuario]').val();
    postData.usuario = $(formEle).find('input[name=usuario]').val();
    postData.email = $(formEle).find('input[name=email]').val();
    postData.permissao = $(formEle).find('select[name=permissao]').val();
    postData.telefone = $(formEle).find('input[name=telefone]').val();
    postData.nascimento = $(formEle).find('input[name=nascimento]').val();
    postData.senha = $(formEle).find('input[name=senha]').val();
    postData.senhaConfirm = $(formEle).find('input[name=senhaConfirm]').val();
    // Validando todos os campos obrigatorios
    var error = false;
    var express = /[@]/;

    if (postData.usuario.length <= 0) { toastr['warning']("Preencha o nome do usuário"); error = true; }
    if (postData.email.length <= 0) { toastr['warning']("Preencha o e-mail do usuário"); error = true; }
    if (postData.permissao.length <= 0) { toastr['warning']("Selecione a permissão do usuário"); error = true; }
    if (postData.telefone.length <= 0) { toastr['warning']("Preencha o telefone do usuário"); error = true; }
    if (postData.nascimento.length <= 0) { toastr['warning']("Preencha a data de nascimento do usuário"); error = true; }

    if (postData.id_usuario === '0' || postData.id_usuario == '') {
        if (postData.senha.length <= 0) { toastr['warning']("Informe a senha do usuário"); error = true; }
        if (postData.senhaConfirm.length <= 0) { toastr['warning']("Confirme a senha do usuário"); error = true; }
    }

    if (postData.senha != postData.senhaConfirm) {
        toastr['warning']("As senhas não são compatíveis"); error = true;
    }
    var express = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$*&@#]{8,}$/;

    if (!express.test(postData.senha)) {
        toastr["error"]("Senha invalída!");
        return false;
    }
    if (error) return false;


    // Confirmando ação de validação
    bootbox.dialog({
        onEscape: true,
        title: 'Validação do Cadastro',
        message: 'Deseja confirmar os registros do usuário?',
        buttons: {
            confirm: {
                label: '<i class="fa fa-check"></i> Sim', className: 'btn btn-primary', callback: function () {
                    // Confirmar validação da foto?
                    __UpdateUsuarioRegister();
                }
            },
            cancel: { label: '<i class="fa fa-times"></i> Não', className: 'btn btn-secondary' }
        }
    });
}

function __UpdateUsuarioRegister() {

    $(".modal-loads").addClass('modal-import-active');
    if (inRequest) return;
    else inRequest = true;


    var formEle = $('#usuario-form');
    var postData = {};

    var formdata = new FormData($("#usuario-form")[0]);

    postData.id_usuario = $(formEle).find('input[name=id_usuario]').val();
    postData.usuario = $(formEle).find('input[name=usuario]').val();
    postData.email = $(formEle).find('input[name=email]').val();
    postData.permissao = $(formEle).find('select[name=permissao]').val();
    postData.telefone = $(formEle).find('input[name=telefone]').val();
    postData.nascimento = $(formEle).find('input[name=nascimento]').val();
    postData.senha = $(formEle).find('input[name=senha]').val();
    postData.senhaConfirm = $(formEle).find('input[name=senhaConfirm]').val();
    postData.cliente = $(formEle).find('select[name=cliente]').val();

    var express = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$*&@#]{8,}$/;

    if (!express.test(postData.senha)) {
        toastr["error"]("Senha invalída!");
        return false;
    }

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });

    $.ajax({
        type: 'POST',
        data: formdata,
        url: getUrl() + "/registrar/usuario",
        processData: false,
        contentType: false,
        success: function (resp) {
            if (resp.status == 'success') {
                toastr["success"]("Usuário registrado com sucesso. Contacte um administrador para liberar o acesso.");
                setTimeout(function () {
                    window.location.href = getUrl() + '/'
                }, 2000)
                return;

            } else if (resp.status == 'error') {
                toastr["error"](resp.message);
                setTimeout(function () {
                    window.location.href = getUrl() + '/'
                }, 2000)
                return;

            } else {
                toastr["error"]("Error");
            }
        },
        error: function (jqXHR) {
            $(".modal-loads").removeClass('modal-import-active');
            toastr["error"](jqXHR.responseText);
        }
    });

}