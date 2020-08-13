var schoolSelDialog;
var tableTimeShet;
var timeshetDIalog;
var inRequest = false;

$(function () {

    setTimeout(function () {
        $(".alert").fadeOut(500);
    }, 2000);

    $(document).on("change", "#table-filter-select", function () {
        if ($(this).val() == "data") {
            $(document)
                .find("#table-filter-text")
                .mask("00/00/0000", { clearIfNotMatch: true });
        } else {
            $(document)
                .find("#table-filter-text")
                .unmask();
        }
    });

    tableTimeShet = $('#table-timeshet').DataTable({
        searching: false,
        ordering: false,
        paging: false,
        info: false,
        scrollY: '50vh',
        scrollCollapse: true,
        language: { "url": getUrl() + '/plugins/datatables/Portuguese-Brasil.json' },
    });
    $('#table-timeshet thead').on('click', '.select-all', function () {
        if ($(this).is(':checked')) tableTimeShet.rows().select();
        else tableTimeShet.rows().deselect();
    });

    ListarDadosTabela(1);


});
$(document).on('click', '.btn-import', function () {
    _ImportarArquivoView();
});

$(document).on('click', '.btn-novo', function () {
    _ViewAlunoDetail(0, '', '', '', '');
});

$(document).on('click', '#table-timeshet-navgitation .page-item', function () {
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
    var tData = tableTimeShet.row(_this).data();
    var idtimeshet = parseInt(tData[0]);
    _ViewAlunoDetail(idtimeshet);
});

function _ViewAlunoDetail(idtimeshet) {

    // Requisitando o dialog com os dados do aluno preenchido
    ShowLoading((idtimeshet == 0 || idtimeshet.length <= 0) ? "Adicionando timeshet" : "Abrindo timeshet...");

    $.ajax({
        url: getUrl() + "/timeshet/data/dialog-detalhe-timeshet?id_timeshet=" + idtimeshet,
        success: function (resp) {
            HideLoading();
            // Abrindo o dialogBox

            timeshetDialog = bootbox.dialog({
                onEscape: true,
                title: 'Incluir Novo Time Shet',
                message: resp,
                size: 'sm',
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-close"></i> Cancelar',
                        className: 'btn btn-secondary'
                    },
                    validate: {
                        label: '<i class="fa fa-check"></i> Lançar',
                        className: 'btn btn-primary',
                        callback: function () {
                            _DialogBox_Validadetimeshet(); return false;
                        }
                    }

                },
                onShown: function () {
                    _InitializeAutoComplete();
                    $('.select-cliente').select2();
                    $('.mask-date').mask('00/00/0000', { clearIfNotMatch: true });
                    $('.mask-phone').mask('(00) 0000-0000P', { clearIfNotMatch: true, 'translation': { P: { pattern: /[0-9]/, optional: true } } });
                    $('.mask-cep').mask('00000-000', { reverse: true, clearIfNotMatch: true });
                    $('.mask-cnpj').mask('00.000.000/0000-00', { reverse: true, clearIfNotMatch: true });
                    $('.mask-numberonly').mask('0#');
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
    if (act == 'next' || act == 'Próxima') page = parseInt($('#table-timeshet-navgitation').find('li.active').text()) + 1;
    else if (act == 'prev' || act == 'Anterior') page = parseInt($('#table-timeshet-navgitation').find('li.active').text()) - 1;
    else if (act == 'first' || act == 'Primeira') page = 1;
    else if (act == 'last' || act == 'Última') page = 999999;
    else if (typeof (act) == 'number' || isNaN(act) == false) page = act;
    else page = 1;

    // Enviando a requisição
    var filterData = __GetFilterData();
    if (typeof (filterData) != 'string') return;

    $.ajax({
        url: getUrl() + '/timeshet/data/todos?limit=' + limit + "&page=" + page + filterData,
        beforeSend: function () {
            $('#table-timeshet-loading').show();
            $('#table-timeshet tbody').hide();
        },
        success: function (resp) {
            $('#table-timeshet-loading').hide();
            $('#table-timeshet tbody').show();

            $('#table-timeshet-navgitation-cpage').html(resp.page.toLocaleString('pt-BR'));
            $('#table-timeshet-navgitation-tpage').html(resp.total_pages.toLocaleString('pt-BR'));
            $('#table-timeshet-navgitation-tdados').html(resp.total_timeshet.toLocaleString('pt-BR'));

            // Alimentando os dados da navegacao
            _PopulateTableNavigation(resp.page, resp.total_pages);

            // Alimentando os dados da tabela
            _PopulateTableData(resp.data);
        },
        error: function () {
            $('#table-timeshet-loading').hide();
            $('#table-timeshet tbody').show();
        }
    });
}

function _PopulateTableNavigation(currentPage, totalPages, showBeforeSlice) {
    if (typeof (showBeforeSlice) != 'number' || showBeforeSlice < 3) showBeforeSlice = 5;

    var ulElement = $('#table-timeshet-navgitation').find('ul:eq(0)');
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
    var tableBodyEement = $('#table-timeshet').find('tbody:eq(0)');

    // Limpando campos
    tableTimeShet.clear().draw();
    $(tableBodyEement).empty();

    for (var i = 0; i < tableDatas.length; i++) {
        var tData = tableDatas[i];
        var tableRow = "<tr>";
        tableRow += "<td>" + tData.Codigo_Interno + "</td>"; // Terceiro campos,,, Nome/Mãe
        tableRow += "<td>" + tData.Data + "</td>"; // EStatus/AStatus
        tableRow += "<td>" + tData.Usuario_Nome + "</td>"; // EStatus/AStatus
        tableRow += "<td>" + tData.Cliente_Nome + "</td>"; // EStatus/AStatus
        tableRow += "<td>" + tData.Area + "</td>"; // EStatus/AStatus
        tableRow += "<td>" + tData.Descricao + "</td>"; // EStatus/AStatus
        tableRow += "<td>" + tData.Tempo_Real + "</td>"; // EStatus/AStatus
        tableRow += "</tr>";

        var jRow = $(tableRow);
        tableTimeShet.row.add(jRow).draw();
    }

    // Redesenhando a table
    tableTimeShet.draw();
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

function _InitializeAutoComplete() {

    $('.select-equipe').select2({
        delay: 50,
        dataType: 'json',
        theme: 'bootstrap',
        minimumInputLength: 2,
        ajax: { url: getUrl() + '/data/autocomplete/usuarios' }
    });
    // if ( gText.length > 0 ) $('#escola_gestor').autoComplete('set', {value: gId, text: gText});
}

function _DialogBox_Validadetimeshet() {
    if (inRequest) {
        ShowLoading("Aguarde... Alterando dados do timeshet.");
        return;
    }

    var formEle = $('#timeshet-form');
    var postData = {};

    postData.cliente = $(formEle).find('select[name=cliente]').val();
    postData.descricao = $(formEle).find('textarea[name=descricao]').val();
    postData.data = $(formEle).find('input[name=data]').val();
    postData.hora = $(formEle).find('input[name=hora]').val();
    postData.min = $(formEle).find('input[name=min]').val();

    // Validando todos os campos obrigatorios
    var error = false;
    var express = /[@]/;

    if (postData.cliente.length <= 0) { toastr['warning']("Selecione um cliente"); error = true; }
    if (postData.descricao.length <= 0) { toastr['warning']("Preencha a descrição do timeshet"); error = true; }
    if (postData.data.length <= 0) { toastr['warning']("Selecione uma data"); error = true; }
    if (postData.hora.length <= 0) { toastr['warning']("Selecione uma hora"); error = true; }
    if (postData.min.length <= 0) { toastr['warning']("Selecione uma minuto"); error = true; }

    if (error) return false;


    // Confirmando ação de validação
    bootbox.dialog({
        onEscape: true,
        title: 'Validação do Cadastro',
        message: 'Deseja confirmar os registros do Time Shet?',
        buttons: {
            confirm: {
                label: '<i class="fa fa-check"></i> Sim', className: 'btn btn-primary', callback: function () {
                    // Confirmar validação da foto?
                    __UpdatetimeshetRegister();
                }
            },
            cancel: { label: '<i class="fa fa-times"></i> Não', className: 'btn btn-secondary' }
        }
    });
}

function __UpdatetimeshetRegister() {

    $(".modal-loads").addClass('modal-import-active');
    if (inRequest) return;
    else inRequest = true;


    var formEle = $('#timeshet-form');
    var postData = {};

    var formdata = new FormData($("#timeshet-form")[0]);

    postData.cliente = $(formEle).find('select[name=cliente]').val();
    postData.descricao = $(formEle).find('input[name=descricao]').val();
    postData.data = $(formEle).find('input[name=data]').val();
    postData.hora = $(formEle).find('input[name=hora]').val();
    postData.min = $(formEle).find('input[name=min]').val();


    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    });

    $.ajax({
        type: 'POST',
        data: formdata,
        url: getUrl() + "/timeshet/data/alterar/registro",
        processData: false,
        contentType: false,
        success: function (resp) {
            inRequest = false;

            toastr["success"]("Dados salvos com sucesso!");
            timeshetDialog.modal('hide');
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
        message: 'Tem certeza que deseja remover esse timeshet?',
        buttons: {
            cancel: {
                label: 'Não', className: 'btn-secondary', callback: function () {
                }
            },
            ok: {
                label: 'Sim', className: 'btn-primary', callback: function () {
                    ShowLoading("Removendo timeshet");
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('input[name="_token"]').attr('content')
                        }
                    });

                    $.ajax({
                        url: getUrl() + '/timeshet/data/remove?id=' + id,
                        success: function (resp) {
                            HideLoading()
                            toastr["success"]("timeshet removido com sucesso");
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

function _ImportarArquivoView() {
    // Requisitando o dialog com os dados do aluno preenchido
    ShowLoading("Abrindo painel");

    $.ajax({
        url: getUrl() + "/timeshet/data/dialog-import-timeshet",
        success: function (resp) {
            HideLoading();
            // Abrindo o dialogBox

            timeshetDialog = bootbox.dialog({
                onEscape: true,
                title: 'Importar Time Shet',
                message: resp,
                size: 'sm',
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-close"></i> Cancelar',
                        className: 'btn btn-secondary'
                    },
                    validate: {
                        label: '<i class="fa fa-check"></i> Importar',
                        className: 'btn btn-primary',
                        callback: function () {
                            var formdata = new FormData($("#timeshet-importar-form")[0]);
                            $.ajaxSetup({
                                headers: {
                                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                                }
                            });
                            $.ajax({
                                type: 'POST',
                                data: formdata,
                                url: getUrl() + "/timesheet/data/importar/arquivo",
                                processData: false,
                                contentType: false,
                                success: function (resp) {
                                    HideLoading();
                                    inRequest = false;
                                    console.log(resp)
                                    toastr[resp.status](resp.message);
                                    ListarDadosTabela(1);

                                },
                                error: function (jqXHR) {
                                    inRequest = false;
                                    toastr["error"](jqXHR.responseText);
                                }
                            });
                        }
                    }

                },
                onShown: function () {
                    $("#arquivo").on("change", function () {
                        $(".importar-arquivo p").text($("#arquivo").val());

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