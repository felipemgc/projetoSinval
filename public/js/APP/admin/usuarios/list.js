var schoolSelDialog;
var tableUsuarios;
var usuariosDialog;
var inRequest = false;

$(function () {

    setTimeout(function () {
        $(".alert").fadeOut(500);
    }, 2000);


    $(document).on("click", ".btn-remove-foto", function () {
        $('#preview').attr('src', 'img/default.jpg');
        $("#fotoUsuario").val('')

        $("#usuario-form").append($("<input type='hidden' name='fileRemoved' id='fileRemoved' value='removed'> "))

        $(this).text("Adicionar")
        $(this).removeClass('btn-remove-foto')
        $(this).addClass("btn-add-picture")
    })


    tableUsuarios = $('#table-usuarios').DataTable({
        searching: false,
        ordering: false,
        paging: false,
        info: false,
        scrollY: '50vh',
        scrollCollapse: true,
        language: { "url": getUrl() + '/plugins/datatables/Portuguese-Brasil.json' },
    });
    $('#table-usuarios thead').on('click', '.select-all', function () {
        if ($(this).is(':checked')) tableUsuarios.rows().select();
        else tableUsuarios.rows().deselect();
    });

    ListarDadosTabela(1);
});

$(document).on('click', '.btn-novo', function () {
    _ViewAlunoDetail(0, '', '', '', '');
});

$(document).on('click', '#table-usuarios-navgitation .page-item', function () {
    if ($(this).hasClass('disabled')) return;
    else ListarDadosTabela($(this).text());
});
$(document).on('keydown', '#table-filter-text', function (e) {
    if (e.which == 13) {
        e.preventDefault();
        ListarDadosTabela(1);
    }
});
$(document).on('click', '.btn-table-filter', function () {
    ListarDadosTabela(1);
}); $(document).on('click', '.btn-filter-clear', function () {
    $("#table-filter-select").val('');

    ListarDadosTabela(1);
    $('#table-filter-select').find('option').removeProp('selected');
    $('#table-filter-select').find('option:eq(0)').prop('selected', 'selected');
    $('#table-filter-text').val("");
});



var oneClickTV = null;
var oneClick = null;
$(document).on('click', '.btn-edit', function () {
    _this = $(this).parent().parent()
    var tData = tableUsuarios.row(_this).data();
    var idUsuario = parseInt(tData[0]);
    _ViewAlunoDetail(idUsuario);
});

function _ViewAlunoDetail(idUsuario) {

    // Requisitando o dialog com os dados do aluno preenchido
    ShowLoading((idUsuario == 0 || idUsuario.length <= 0) ? "Adicionando Projeto" : "Abrindo Projeto...");

    $.ajax({
        url: getUrl() + "/usuarios/data/dialog-detalhe-usuario?id_usuario=" + idUsuario,
        success: function (resp) {
            HideLoading();
            // Abrindo o dialogBox

            usuarioDIalog = bootbox.dialog({
                onEscape: true,
                title: 'Incluir Novo Usuário',
                message: resp,
                size: 'ml',
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-close"></i> Cancelar',
                        className: 'btn btn-secondary'
                    },
                    validate: {
                        label: '<i class="fa fa-check"></i> Salvar',
                        className: 'btn btn-primary',
                        callback: function () {
                            _DialogBox_ValidadeUsuario(); return false;
                        }
                    }

                },
                onShown: function () {
                    $('.mask-date').mask('00/00/0000', { clearIfNotMatch: true });
                    $('.mask-phone').mask('(00) 0000-0000P', { clearIfNotMatch: true, 'translation': { P: { pattern: /[0-9]/, optional: true } } });
                    $('.mask-cep').mask('00000-000', { reverse: true, clearIfNotMatch: true });
                    $('.mask-cnpj').mask('00.000.000/0000-00', { reverse: true, clearIfNotMatch: true });
                    $('.mask-numberonly').mask('0#');

                    $("#permissao").select2();
                    $("#cliente").select2();
                    $(document).on("change", "#permissao", function () {
                        if ($(this).val() == "3") {

                            $(".cliente-container").fadeIn(500);

                        } else {
                            $(".cliente-container").fadeOut(500);
                            $(this).val();

                        }
                    });

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
                }
            });

        },
        error: function (jqXHR) {
            HideLoading();
            toastr["error"](jqXHR.responseText);
        }
    });
}


function ListarDadosTabela(act) {
    var page = 1;
    var limit = 15;
    if (act == 'next' || act == 'Próxima') page = parseInt($('#table-usuarios-navgitation').find('li.active').text()) + 1;
    else if (act == 'prev' || act == 'Anterior') page = parseInt($('#table-usuarios-navgitation').find('li.active').text()) - 1;
    else if (act == 'first' || act == 'Primeira') page = 1;
    else if (act == 'last' || act == 'Última') page = 999999;
    else if (typeof (act) == 'number' || isNaN(act) == false) page = act;
    else page = 1;

    // Enviando a requisição
    var filterData = __GetFilterData();
    if (typeof (filterData) != 'string') return;

    $.ajax({
        url: getUrl() + '/usuarios/data/todos?limit=' + limit + "&page=" + page + filterData,
        beforeSend: function () {
            $('#table-usuarios-loading').show();
            $('#table-usuarios tbody').hide();
        },
        success: function (resp) {
            $('#table-usuarios-loading').hide();
            $('#table-usuarios tbody').show();

            console.log(resp)
            $('#table-usuarios-navgitation-cpage').html(resp.page.toLocaleString('pt-BR'));
            $('#table-usuarios-navgitation-tpage').html(resp.total_pages.toLocaleString('pt-BR'));
            $('#table-usuarios-navgitation-tdados').html(resp.total_usuarios.toLocaleString('pt-BR'));

            // Alimentando os dados da navegacao
            _PopulateTableNavigation(resp.page, resp.total_pages);

            // Alimentando os dados da tabela
            _PopulateTableData(resp.data);
        },
        error: function () {
            $('#table-usuarios-loading').hide();
            $('#table-usuarios tbody').show();
        }
    });
}

function _PopulateTableNavigation(currentPage, totalPages, showBeforeSlice) {
    if (typeof (showBeforeSlice) != 'number' || showBeforeSlice < 3) showBeforeSlice = 5;

    var ulElement = $('#table-usuarios-navgitation').find('ul:eq(0)');
    $(ulElement).empty();

    // Preparando variaveis de controle
    var startPCount = 1;
    var showEllipsesStart = false;
    var showEllipsesEnd = false;
    if (totalPages > 6) {
        if (currentPage > 5) {
            showEllipsesStart = true;
            if ((currentPage + 5) < totalPages) {
                showEllipsesEnd = true;
                startPCount = (currentPage - 2);
            }
            else startPCount = (totalPages - 5);
        } else {
            showEllipsesEnd = true;
        }
    }

    // Populando/Criando elementos...
    if (showEllipsesStart) {
        $(ulElement).append('<li class="page-item disabled"><a class="page-link" href="#">...</a></li>');
    }

    for (var i = 0; startPCount <= totalPages && i <= 6; startPCount++, i++) {
        var isCurrentPage = (startPCount == currentPage);
        var newHtmlData = '<li class="page-item ' + (isCurrentPage ? 'active' : '') + '"><a class="page-link" href="#">';
        newHtmlData += startPCount + '</a></li>';

        $(ulElement).append(newHtmlData);
    }

    // Checando se deve adicionar o slice...
    if (showEllipsesEnd) {
        $(ulElement).append('<li class="page-item disabled"><a class="page-link" href="#">...</a></li>');
    }

    // Adicionando os botões de navegação (prev/next)
    $(ulElement).prepend('<li class="page-item ' + ((currentPage > 1) ? '' : 'disabled') + '"><a class="page-link" href="#" tabindex="-1">Anterior</a></li>');
    $(ulElement).prepend('<li class="page-item ' + ((currentPage > 1) ? '' : 'disabled') + '"><a class="page-link" href="#" tabindex="-1">Primeira</a></li>');
    $(ulElement).append('<li class="page-item ' + ((currentPage >= totalPages) ? 'disabled' : '') + '"><a class="page-link" href="#">Próxima</a></li>');
    $(ulElement).append('<li class="page-item ' + ((currentPage >= totalPages) ? 'disabled' : '') + '"><a class="page-link" href="#">Última</a></li>');
}


function _PopulateTableData(tableDatas) {
    var tableBodyEement = $('#table-usuarios').find('tbody:eq(0)');

    // Limpando campos
    tableUsuarios.clear().draw();
    $(tableBodyEement).empty();

    for (var i = 0; i < tableDatas.length; i++) {
        var tData = tableDatas[i];
        var tableRow = "<tr>";
        if (tData.Status == 0) {
            tData.Status = 'Intivo'
        } else {
            tData.Status = 'Ativo'
        }
        tableRow += "<td>" + tData.Codigo_Interno + "</td>"; // Terceiro campos,,, Nome/Mãe
        tableRow += "<td><div class='img-td-box' style='border-radius: 8%; width: 3em; height: 3em;'> <img src='" + tData.Foto_Usuario + "'></div></td>"; // EStatus/AStatus
        tableRow += "<td>" + tData.Nome + "</td>"; // EStatus/AStatus
        tableRow += "<td>" + tData.Email + "</td>"; // EStatus/AStatus
        tableRow += "<td>" + tData.Perfil + "</td>"; // EStatus/AStatus
        tableRow += "<td>" + tData.Status + "</td>"; // EStatus/AStatus
        if ($("#profile").length > 0) {
            tableRow += "<td><button class='btn btn-edit'><i class='fa fa-pencil' aria-hidden='true'></i></button> <button class='btn btn-clean'><i class='fa fa-trash'aria-hidden='true'></i></button></td>"; // EStatus/AStatus
        }
        tableRow += "</tr>";

        var jRow = $(tableRow);
        tableUsuarios.row.add(jRow).draw();
    }

    // Redesenhando a table
    tableUsuarios.draw();
}

function __GetFilterData() {
    var filterSelectValue = $('#table-filter-select').val();
    var filterTextValue = $('#table-filter-text').val();

    if (filterSelectValue.length <= 0 || filterTextValue.length <= 0) return "";
    else if (filterTextValue.length <= 3 && isNaN(parseInt(filterTextValue))) {
        toastr["warning"]("Você deve digitar no mínimo 4 caracteres para realizar a filtragem!");
        return false;
    }

    filterTextValue = filterTextValue.replace(/%/gi, "%25");
    var urlQueryText = "&" + filterSelectValue + "=" + filterTextValue;
    return urlQueryText;
}


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
    postData.status = $(formEle).find('select[name=status]').val();
    // Validando todos os campos obrigatorios
    var error = false;
    var express = /[@]/;

    if (postData.usuario.length <= 0) { toastr['warning']("Preencha o nome do usuário"); error = true; }
    if (postData.email.length <= 0) { toastr['warning']("Preencha o e-mail do usuário"); error = true; }
    if (postData.permissao.length <= 0) { toastr['warning']("Selecione a permissão do usuário"); error = true; }
    if (postData.telefone.length <= 0) { toastr['warning']("Preencha o telefone do usuário"); error = true; }
    if (postData.nascimento.length <= 0) { toastr['warning']("Preencha a data de nascimento do usuário"); error = true; }
    if (postData.status.length <= 0) { toastr['warning']("Selecione o status do usuário"); error = true; }

    if (postData.id_usuario === '0' || postData.id_usuario == '') {
        if (postData.senha.length <= 0) { toastr['warning']("Informe a senha do usuário"); error = true; }
        if (postData.senhaConfirm.length <= 0) { toastr['warning']("Confirme a senha do usuário"); error = true; }
    }

    if (postData.senha != postData.senhaConfirm) {
        toastr['warning']("As senhas não são compatíveis"); error = true;
    }

    var express = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$*&@#]{8,}$/;

    if (postData.senha.length > 0) {
        if (!express.test(postData.senha)) {
            toastr["error"]("Senha invalída!");
            return false;
        }
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
    ShowLoading("Aguarde...Salvando registro");

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
    postData.status = $(formEle).find('select[name=status]').val();

    var express = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$*&@#]{8,}$/;

    if (postData.senha.length > 0) {
        if (!express.test(postData.senha)) {
            toastr["error"]("Senha invalída!");
            return false;
        }
    }


    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });

    $.ajax({
        type: 'POST',
        data: formdata,
        url: getUrl() + "/usuarios/data/alterar/registro",
        processData: false,
        contentType: false,
        success: function (resp) {
            HideLoading();
            inRequest = false;

            toastr["success"]("Dados salvos com sucesso!");
            usuarioDIalog.modal('hide');
            ListarDadosTabela(1);

        },
        error: function (jqXHR) {
            inRequest = false;
            $(".modal-loads").removeClass('modal-import-active');
            toastr["error"](jqXHR.responseText);
        }
    });

}

$(document).on("click", ".btn-clean", function () {
    let _this = $(this),
        id = _this.parent().parent().find('td').first().text();

    schoolSelDialog = bootbox.dialog({
        onEscape: false,
        title: 'Confirmação',
        closeButton: false,
        message: 'Tem certeza que deseja remover esse usuário?',
        buttons: {
            cancel: {
                label: 'Não', className: 'btn-secondary', callback: function () {
                }
            },
            ok: {
                label: 'Sim', className: 'btn-primary', callback: function () {
                    ShowLoading("Removendo Usuário");
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('input[name="_token"]').attr('content')
                        }
                    });

                    $.ajax({
                        url: getUrl() + '/usuarios/data/remove?id=' + id,
                        success: function (resp) {
                            HideLoading()
                            toastr["success"]("Usuário removido com sucesso");
                            ListarDadosTabela(1);
                        },
                        error: function () {
                            HideLoading()
                            toastr["error"](jqXHR.responseText);
                        }
                    });
                }
            }
        }
    });

});