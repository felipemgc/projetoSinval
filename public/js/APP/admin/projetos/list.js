var schoolSelDialog;
var tableProjetos;
var projetosDIalog;
var inRequest = false;

$(function() {
  setTimeout(function() {
    $(".alert").fadeOut(500);
  }, 2000);

  tableProjetos = $("#table-projetos").DataTable({
    searching: false,
    ordering: false,
    paging: false,
    info: false,
    scrollY: "50vh",
    scrollCollapse: true,
    language: { url: getUrl() + "/plugins/datatables/Portuguese-Brasil.json" }
  });
  $("#table-projetos thead").on("click", ".select-all", function() {
    if ($(this).is(":checked")) tableProjetos.rows().select();
    else tableProjetos.rows().deselect();
  });

  ListarDadosTabela(1);
});

$(document).on("click", ".btn-novo", function() {
  _ViewAlunoDetail(0, "", "", "", "");
});

$(document).on("click", "#table-projetos-navgitation .page-item", function() {
  if ($(this).hasClass("disabled")) return;
  else ListarDadosTabela($(this).text());
});
$(document).on("keydown", "#table-filter-text", function(e) {
  if (e.which == 13) {
    e.preventDefault();
    ListarDadosTabela(1);
  }
});
$(document).on("click", ".btn-table-filter", function() {
  ListarDadosTabela(1);
});
$(document).on("click", ".btn-filter-clear", function() {
  $("#table-filter-select").val("");

  ListarDadosTabela(1);
  $("#table-filter-select")
    .find("option")
    .removeProp("selected");
  $("#table-filter-select")
    .find("option:eq(0)")
    .prop("selected", "selected");
  $("#table-filter-text").val("");
});

var oneClickTV = null;
var oneClick = null;
$(document).on("click", ".btn-edit", function() {
  _this = $(this)
    .parent()
    .parent();
  var tData = tableProjetos.row(_this).data();
  var idProjeto = parseInt(tData[0]);
  _ViewAlunoDetail(idProjeto);
});

function _ViewAlunoDetail(idProjeto) {
  // Requisitando o dialog com os dados do aluno preenchido
  ShowLoading(
    idProjeto == 0 || idProjeto.length <= 0
      ? "Adicionando Projeto"
      : "Abrindo Projeto..."
  );

  $.ajax({
    url:
      getUrl() +
      "/projetos/data/dialog-detalhe-projeto?id_projeto=" +
      idProjeto,
    success: function(resp) {
      HideLoading();
      // Abrindo o dialogBox

      projetoDialog = bootbox.dialog({
        onEscape: true,
        title: "Incluir Novo Projeto",
        message: resp,
        size: "ml",
        buttons: {
          cancel: {
            label: '<i class="fa fa-close"></i> Cancelar',
            className: "btn btn-secondary"
          },
          validate: {
            label: '<i class="fa fa-check"></i> Salvar',
            className: "btn btn-primary",
            callback: function() {
              _DialogBox_ValidadeProjeto();
              return false;
            }
          }
        },
        onShown: function() {
          _InitializeAutoComplete();
          $(".mask-date").mask("00/00/0000", { clearIfNotMatch: true });
          $(".mask-phone").mask("(00) 0000-0000P", {
            clearIfNotMatch: true,
            translation: { P: { pattern: /[0-9]/, optional: true } }
          });
          $(".mask-cep").mask("00000-000", {
            reverse: true,
            clearIfNotMatch: true
          });
          $(".mask-cnpj").mask("00.000.000/0000-00", {
            reverse: true,
            clearIfNotMatch: true
          });
          $(".mask-numberonly").mask("0#");
        }
      });
    },
    error: function(jqXHR) {
      HideLoading();
      toastr["error"](jqXHR.responseText);
    }
  });
}

function ListarDadosTabela(act) {
  var page = 1;
  var limit = 15;
  if (act == "next" || act == "Próxima")
    page =
      parseInt(
        $("#table-projetos-navgitation")
          .find("li.active")
          .text()
      ) + 1;
  else if (act == "prev" || act == "Anterior")
    page =
      parseInt(
        $("#table-projetos-navgitation")
          .find("li.active")
          .text()
      ) - 1;
  else if (act == "first" || act == "Primeira") page = 1;
  else if (act == "last" || act == "Última") page = 999999;
  else if (typeof act == "number" || isNaN(act) == false) page = act;
  else page = 1;

  // Enviando a requisição
  var filterData = __GetFilterData();
  if (typeof filterData != "string") return;

  $.ajax({
    url:
      getUrl() +
      "/projetos/data/todos?limit=" +
      limit +
      "&page=" +
      page +
      filterData,
    beforeSend: function() {
      $("#table-projetos-loading").show();
      $("#table-projetos tbody").hide();
    },
    success: function(resp) {
      $("#table-projetos-loading").hide();
      $("#table-projetos tbody").show();

      $("#table-projetos-navgitation-cpage").html(
        resp.page.toLocaleString("pt-BR")
      );
      $("#table-projetos-navgitation-tpage").html(
        resp.total_pages.toLocaleString("pt-BR")
      );
      $("#table-projetos-navgitation-tdados").html(
        resp.total_projetos.toLocaleString("pt-BR")
      );

      // Alimentando os dados da navegacao
      _PopulateTableNavigation(resp.page, resp.total_pages);

      // Alimentando os dados da tabela
      _PopulateTableData(resp.data);
    },
    error: function() {
      $("#table-projetos-loading").hide();
      $("#table-projetos tbody").show();
    }
  });
}

function _PopulateTableNavigation(currentPage, totalPages, showBeforeSlice) {
  if (typeof showBeforeSlice != "number" || showBeforeSlice < 3)
    showBeforeSlice = 5;

  var ulElement = $("#table-projetos-navgitation").find("ul:eq(0)");
  $(ulElement).empty();

  // Preparando variaveis de controle
  var startPCount = 1;
  var showEllipsesStart = false;
  var showEllipsesEnd = false;
  if (totalPages > 6) {
    if (currentPage > 5) {
      showEllipsesStart = true;
      if (currentPage + 5 < totalPages) {
        showEllipsesEnd = true;
        startPCount = currentPage - 2;
      } else startPCount = totalPages - 5;
    } else {
      showEllipsesEnd = true;
    }
  }

  // Populando/Criando elementos...
  if (showEllipsesStart) {
    $(ulElement).append(
      '<li class="page-item disabled"><a class="page-link" href="#">...</a></li>'
    );
  }

  for (var i = 0; startPCount <= totalPages && i <= 6; startPCount++, i++) {
    var isCurrentPage = startPCount == currentPage;
    var newHtmlData =
      '<li class="page-item ' +
      (isCurrentPage ? "active" : "") +
      '"><a class="page-link" href="#">';
    newHtmlData += startPCount + "</a></li>";

    $(ulElement).append(newHtmlData);
  }

  // Checando se deve adicionar o slice...
  if (showEllipsesEnd) {
    $(ulElement).append(
      '<li class="page-item disabled"><a class="page-link" href="#">...</a></li>'
    );
  }

  // Adicionando os botões de navegação (prev/next)
  $(ulElement).prepend(
    '<li class="page-item ' +
      (currentPage > 1 ? "" : "disabled") +
      '"><a class="page-link" href="#" tabindex="-1">Anterior</a></li>'
  );
  $(ulElement).prepend(
    '<li class="page-item ' +
      (currentPage > 1 ? "" : "disabled") +
      '"><a class="page-link" href="#" tabindex="-1">Primeira</a></li>'
  );
  $(ulElement).append(
    '<li class="page-item ' +
      (currentPage >= totalPages ? "disabled" : "") +
      '"><a class="page-link" href="#">Próxima</a></li>'
  );
  $(ulElement).append(
    '<li class="page-item ' +
      (currentPage >= totalPages ? "disabled" : "") +
      '"><a class="page-link" href="#">Última</a></li>'
  );
}

function _PopulateTableData(tableDatas) {
  var tableBodyEement = $("#table-projetos").find("tbody:eq(0)");

  // Limpando campos
  tableProjetos.clear().draw();
  $(tableBodyEement).empty();

  for (var i = 0; i < tableDatas.length; i++) {
    var tData = tableDatas[i];
    var equipes = "";
    var empresas = "";
    var counter = 0;
    for (var img in tData.Fotos_Equipe) {
      if (counter < 4) {
        equipes +=
          "<div class='box-equipe'><img src='" +
          img +
          "' title='" +
          tData.Fotos_Equipe[img] +
          "'></div>";
      } else if (counter == 4) {
        equipes +=
          "<div class='box-alert' style='font-size:0.9em'>+" +
          (Object.keys(tData.Fotos_Equipe).length - 4) +
          "</div>";
      }
      counter++;
    }

    counter = 0;
    for (var imgCliente in tData.Fotos_Empresas) {
      if (counter < 4) {
        empresas +=
          "<div class='box-equipe'><img src='" +
          imgCliente +
          "' title='" +
          tData.Fotos_Empresas[imgCliente] +
          "'></div>";
      } else if (counter == 4) {
        empresas +=
          "<div class='box-alert' style='font-size:0.9em'>+" +
          (Object.keys(tData.Fotos_Empresas).length - 4) +
          "</div>";
      }
      counter++;
    }

    var tableRow = "<tr>";
    tableRow += "<td style='width: 3em'>" + tData.Codigo_Interno + "</td>"; // Terceiro campos,,, Nome/Mãe
    tableRow +=
      "<td><div class='container-equipes'>" + empresas + "</div></td>"; // EStatus/AStatus

    ("'></div></td>"); // EStatus/AStatus
    tableRow += "<td>" + tData.Nome_Projeto + "</td>"; // EStatus/AStatus
    tableRow += "<td>" + tData.Descricao_Projeto + "</td>"; // EStatus/AStatus
    tableRow += "<td><div class='container-equipes'>" + equipes + "</div></td>"; // EStatus/AStatus
    if ($("#profile").length > 0) {
      tableRow +=
        "<td><button class='btn btn-edit'><i class='fa fa-pencil' aria-hidden='true'></i></button> <button class='btn btn-clean'><i class='fa fa-trash'aria-hidden='true'></i></button></td>"; // EStatus/AStatus
    }
    tableRow += "</tr>";

    var jRow = $(tableRow);
    tableProjetos.row.add(jRow).draw();
  }

  // Redesenhando a table
  tableProjetos.draw();
}

function __GetFilterData() {
  var filterSelectValue = $("#table-filter-select").val();
  var filterTextValue = $("#table-filter-text").val();

  if (filterSelectValue.length <= 0 || filterTextValue.length <= 0) return "";
  else if (filterTextValue.length <= 3 && isNaN(parseInt(filterTextValue))) {
    toastr["warning"](
      "Você deve digitar no mínimo 4 caracteres para realizar a filtragem!"
    );
    return false;
  }

  filterTextValue = filterTextValue.replace(/%/gi, "%25");
  var urlQueryText = "&" + filterSelectValue + "=" + filterTextValue;
  return urlQueryText;
}

function _InitializeAutoComplete() {
  $(".select-equipe").select2({
    delay: 50,
    dataType: "json",
    theme: "bootstrap",
    minimumInputLength: 2,
    ajax: { url: getUrl() + "/data/autocomplete/usuarios" }
  });

  $(".select-cliente").select2({
    delay: 50,
    dataType: "json",
    theme: "bootstrap",
    minimumInputLength: 2,
    ajax: { url: getUrl() + "/data/autocomplete/empresas" }
  });

  // if ( gText.length > 0 ) $('#escola_gestor').autoComplete('set', {value: gId, text: gText});
}

function _DialogBox_ValidadeProjeto() {
  if (inRequest) {
    ShowLoading("Aguarde... Alterando dados do projeto.");
    return;
  }

  var formEle = $("#project-form");
  var postData = {};

  postData.id_projeto = $(formEle)
    .find("input[name=id_projeto]")
    .val();
  postData.projeto = $(formEle)
    .find("input[name=projeto]")
    .val();
  postData.empresa = $(formEle)
    .find(".select-cliente")
    .val();
  postData.descricao = $(formEle)
    .find("input[name=descricao]")
    .val();
  postData.equipe = $(formEle)
    .find(".select-equipe")
    .val();

  // Validando todos os campos obrigatorios
  var error = false;
  var express = /[@]/;

  if (postData.projeto.length <= 0) {
    toastr["warning"]("Preencha o nome do projeto");
    error = true;
  }
  if (postData.empresa.length <= 0) {
    toastr["warning"]("Selecione uma empresa");
    error = true;
  }
  if (postData.equipe.length <= 0) {
    toastr["warning"]("Selecione um time");
    error = true;
  }

  if (error) return false;

  // Confirmando ação de validação
  bootbox.dialog({
    onEscape: true,
    title: "Validação do Cadastro",
    message: "Deseja confirmar os registros do projeto?",
    buttons: {
      confirm: {
        label: '<i class="fa fa-check"></i> Sim',
        className: "btn btn-primary",
        callback: function() {
          // Confirmar validação da foto?
          __UpdateProjetoRegister();
        }
      },
      cancel: {
        label: '<i class="fa fa-times"></i> Não',
        className: "btn btn-secondary"
      }
    }
  });
}

function __UpdateProjetoRegister() {
  $(".modal-loads").addClass("modal-import-active");
  if (inRequest) return;
  else inRequest = true;

  var formEle = $("#project-form");
  var postData = {};

  var formdata = new FormData($("#project-form")[0]);

  postData.id_projeto = $(formEle)
    .find("input[name=id_projeto]")
    .val();
  postData.projeto = $(formEle)
    .find("input[name=projeto]")
    .val();
  postData.empresa = $(formEle)
    .find("select[name=empresa]")
    .val();
  postData.descricao = $(formEle)
    .find("input[name=descricao]")
    .val();
  postData.equipe = $(formEle)
    .find("select[name=equipe]")
    .val();

  $.ajaxSetup({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="_token"]').attr("content")
    }
  });

  $.ajax({
    type: "POST",
    data: formdata,
    url: getUrl() + "/projetos/data/alterar/registro",
    processData: false,
    contentType: false,
    success: function(resp) {
      inRequest = false;

      toastr["success"]("Dados salvos com sucesso!");
      projetoDialog.modal("hide");
      ListarDadosTabela(1);
    },
    error: function(jqXHR) {
      inRequest = false;
      $(".modal-loads").removeClass("modal-import-active");
      toastr["error"](jqXHR.responseText);
    }
  });
}

$(document).on("click", ".btn-clean", function() {
  let _this = $(this),
    id = _this
      .parent()
      .parent()
      .find("td")
      .first()
      .text();

  schoolSelDialog = bootbox.dialog({
    onEscape: false,
    title: "Confirmação",
    closeButton: false,
    message: "Tem certeza que deseja remover esse projeto?",
    buttons: {
      cancel: {
        label: "Não",
        className: "btn-secondary",
        callback: function() {}
      },
      ok: {
        label: "Sim",
        className: "btn-primary",
        callback: function() {
          ShowLoading("Removendo Projeto");
          $.ajaxSetup({
            headers: {
              "X-CSRF-TOKEN": $('input[name="_token"]').attr("content")
            }
          });

          $.ajax({
            url: getUrl() + "/projetos/data/remove?id=" + id,
            success: function(resp) {
              HideLoading();
              toastr["success"]("Projeto removido com sucesso");
              ListarDadosTabela(1);
            },
            error: function() {
              HideLoading();
              toastr["error"](jqXHR.responseText);
            }
          });
        }
      }
    }
  });
});
