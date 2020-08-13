var schoolSelDialog;
var tableClientes;
var clientesDIalog;
var inRequest = false;

$(function() {
  setTimeout(function() {
    $(".alert").fadeOut(500);
  }, 2000);

  $(document).on("click", ".btn-remove-foto", function() {
    $("#preview").attr("src", "img/default.jpg");
    $("#fotoCliente").val("");

    $("#client-form").append(
      $(
        "<input type='hidden' name='fileRemoved' id='fileRemoved' value='removed'> "
      )
    );

    $(this).text("Adicionar");
    $(this).removeClass("btn-remove-foto");
    $(this).addClass("btn-add-picture");
  });

  tableClientes = $("#table-clientes").DataTable({
    searching: false,
    ordering: false,
    paging: false,
    info: false,
    scrollY: "50vh",
    scrollCollapse: true,
    language: { url: getUrl() + "/plugins/datatables/Portuguese-Brasil.json" }
  });
  $("#table-clientes thead").on("click", ".select-all", function() {
    if ($(this).is(":checked")) tableClientes.rows().select();
    else tableClientes.rows().deselect();
  });

  ListarDadosTabela(1);
});

$(document).on("click", ".btn-novo", function() {
  _ViewAlunoDetail(0, "", "", "", "");
});

$(document).on("click", "#table-clientes-navgitation .page-item", function() {
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
  var tData = tableClientes.row(_this).data();
  var idCliente = parseInt(tData[0]);
  _ViewAlunoDetail(idCliente);
});

function _ViewAlunoDetail(idCliente) {
  // Requisitando o dialog com os dados do aluno preenchido
  ShowLoading(
    idCliente == 0 || idCliente.length <= 0
      ? "Adicionando Empresa"
      : "Abrindo Empresa..."
  );

  $.ajax({
    url:
      getUrl() +
      "/clientes/data/dialog-detalhe-cliente?id_cliente=" +
      idCliente,
    success: function(resp) {
      HideLoading();
      // Abrindo o dialogBox

      projetoDialog = bootbox.dialog({
        onEscape: true,
        title: "Incluir Nova Empresa",
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
              _DialogBox_ValidadeCliente();
              return false;
            }
          }
        },
        onShown: function() {
          _InitializeAutoComplete();

          $("#cep").blur(function() {
            //Nova variável "cep" somente com dígitos.
            var cep = $(this)
              .val()
              .replace(/\D/g, "");
            //Verifica se campo cep possui valor informado.
            if (cep != "") {
              //Expressão regular para validar o CEP.
              var validacep = /^[0-9]{8}$/;

              //Valida o formato do CEP.
              if (validacep.test(cep)) {
                //Preenche os campos com "..." enquanto consulta webservice.
                $("#rua").val("...");
                $("#bairro").val("...");
                $("#cidade").val("...");
                $("#estado").val("...");

                //Consulta o webservice viacep.com.br/
                $.getJSON(
                  "https://viacep.com.br/ws/" + cep + "/json/?callback=?",
                  function(dados) {
                    if (!("erro" in dados)) {
                      //Atualiza os campos com os valores da consulta.
                      $("#rua").val(dados.logradouro);
                      $("#bairro").val(dados.bairro);
                      $("#cidade").val(dados.localidade);
                      $("#estado").val(dados.uf);
                    } //end if.
                    else {
                      //CEP pesquisado não foi encontrado.
                      limpa_formulário_cep();
                      alert("CEP não encontrado.");
                    }
                  }
                );
              } //end if.
              else {
                //cep é inválido.
                limpa_formulário_cep();
                alert("Formato de CEP inválido.");
              }
            } //end if.
            else {
              //cep sem valor, limpa formulário.
              limpa_formulário_cep();
            }
          });

          $(document).on("change", "#fotoCliente", function() {
            let _this = $(this);
            let input = this;

            if (
              input.files[0].type == "image/png" ||
              input.files[0].type == "image/jpeg" ||
              input.files[0].type == "image/jpg"
            ) {
            } else {
              toastr["error"]("Extensão inválida.");
              return false;
            }

            $("#fileRemoved").remove();

            var reader = new FileReader();
            reader.onload = function(e) {
              $("#preview").attr("src", e.target.result);
            };
            reader.readAsDataURL(input.files[0]);

            $(".btn-add-picture").text("Remover");
            $(".btn-add-picture").addClass("btn-remove-foto");
            $(".btn-remove-foto").removeClass("btn-add-picture");
          });

          $(document).on("click", ".btn-add-picture", function() {
            $(".box-img-cliente").trigger("click");
          });

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
        $("#table-clientes-navgitation")
          .find("li.active")
          .text()
      ) + 1;
  else if (act == "prev" || act == "Anterior")
    page =
      parseInt(
        $("#table-clientes-navgitation")
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
      "/clientes/data/todos?limit=" +
      limit +
      "&page=" +
      page +
      filterData,
    beforeSend: function() {
      $("#table-clientes-loading").show();
      $("#table-clientes tbody").hide();
    },
    success: function(resp) {
      $("#table-clientes-loading").hide();
      $("#table-clientes tbody").show();

      $("#table-clientes-navgitation-cpage").html(
        resp.page.toLocaleString("pt-BR")
      );
      $("#table-clientes-navgitation-tpage").html(
        resp.total_pages.toLocaleString("pt-BR")
      );
      $("#table-clientes-navgitation-tdados").html(
        resp.total_clientes.toLocaleString("pt-BR")
      );

      // Alimentando os dados da navegacao
      _PopulateTableNavigation(resp.page, resp.total_pages);

      // Alimentando os dados da tabela
      _PopulateTableData(resp.data);
    },
    error: function() {
      $("#table-clientes-loading").hide();
      $("#table-clientes tbody").show();
    }
  });
}

function _PopulateTableNavigation(currentPage, totalPages, showBeforeSlice) {
  if (typeof showBeforeSlice != "number" || showBeforeSlice < 3)
    showBeforeSlice = 5;

  var ulElement = $("#table-clientes-navgitation").find("ul:eq(0)");
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
  var tableBodyEement = $("#table-clientes").find("tbody:eq(0)");

  // Limpando campos
  tableClientes.clear().draw();
  $(tableBodyEement).empty();

  for (var i = 0; i < tableDatas.length; i++) {
    var tData = tableDatas[i];
    var tableRow = "<tr>";
    tableRow += "<td>" + tData.Codigo_Interno + "</td>"; // Terceiro campos,,, Nome/Mãe
    tableRow +=
      "<td><div class='img-td-box'> <img src='" +
      tData.Foto_Cliente +
      "'></div></td>"; // EStatus/AStatus
    tableRow += "<td>" + tData.Nome_Cliente + "</td>"; // EStatus/AStatus
    tableRow += "<td>" + tData.CNPJ_Cliente + "</td>"; // EStatus/AStatus
    tableRow += "<td>" + tData.Segmento_Cliente + "</td>"; // EStatus/AStatus
    if ($("#profile").length > 0) {
      tableRow +=
        "<td><button class='btn btn-edit'><i class='fa fa-pencil' aria-hidden='true'></i></button> <button class='btn btn-clean'><i class='fa fa-trash'aria-hidden='true'></i></button></td>"; // EStatus/AStatus
    }
    tableRow += "</tr>";

    var jRow = $(tableRow);
    tableClientes.row.add(jRow).draw();
  }

  // Redesenhando a table
  tableClientes.draw();
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
  // if ( gText.length > 0 ) $('#escola_gestor').autoComplete('set', {value: gId, text: gText});
}

function _DialogBox_ValidadeCliente() {
  if (inRequest) {
    ShowLoading("Aguarde... Alterando dados do cliente.");
    return;
  }

  var formEle = $("#client-form");
  var postData = {};

  postData.id_cliente = $(formEle)
    .find("input[name=id_cliente]")
    .val();
  postData.nome = $(formEle)
    .find("input[name=cliente]")
    .val();
  postData.razao_social = $(formEle)
    .find("input[name=razao_social]")
    .val();
  postData.cnpj = $(formEle)
    .find("input[name=cnpj]")
    .val();
  postData.rua = $(formEle)
    .find("input[name=rua]")
    .val();
  postData.numero = $(formEle)
    .find("input[name=numero]")
    .val();
  postData.cidade = $(formEle)
    .find("input[name=cidade]")
    .val();
  postData.estado = $(formEle)
    .find("input[name=estado]")
    .val();
  postData.cep = $(formEle)
    .find("input[name=cep]")
    .val();
  postData.segmento = $(formEle)
    .find("input[name=segmento]")
    .val();

  // Validando todos os campos obrigatorios
  var error = false;
  var express = /[@]/;

  if (postData.nome.length <= 0) {
    toastr["warning"]("Preencha o nome do cliente");
    error = true;
  }
  if (postData.cnpj.length <= 0) {
    toastr["warning"]("Preencha o CNPJ do cliente");
    error = true;
  }
  if (postData.cidade.length <= 0) {
    toastr["warning"]("Preencha a cidade do cliente");
    error = true;
  }
  if (postData.estado.length <= 0) {
    toastr["warning"]("Preencha o estado do cliente");
    error = true;
  }
  if (postData.cep.length <= 0) {
    toastr["warning"]("Preencha o CEP do cliente");
    error = true;
  }
  if (postData.segmento.length <= 0) {
    toastr["warning"]("Preencha o segmento do cliente");
    error = true;
  }

  if (error) return false;

  // Confirmando ação de validação
  bootbox.dialog({
    onEscape: true,
    title: "Validação do Cadastro",
    message: "Deseja confirmar os registros do cliente?",
    buttons: {
      confirm: {
        label: '<i class="fa fa-check"></i> Sim',
        className: "btn btn-primary",
        callback: function() {
          // Confirmar validação da foto?
          __UpdateClienteRegister();
        }
      },
      cancel: {
        label: '<i class="fa fa-times"></i> Não',
        className: "btn btn-secondary"
      }
    }
  });
}

function __UpdateClienteRegister() {
  ShowLoading("Aguarde...Salvando registro.");

  $(".modal-loads").addClass("modal-import-active");
  if (inRequest) return;
  else inRequest = true;

  var formEle = $("#client-form");
  var postData = {};

  var formdata = new FormData($("#client-form")[0]);

  postData.id_cliente = $(formEle)
    .find("input[name=id_cliente]")
    .val();
  postData.nome = $(formEle)
    .find("input[name=nome]")
    .val();
  postData.razao_social = $(formEle)
    .find("input[name=razao_social]")
    .val();
  postData.cnpj = $(formEle)
    .find("input[name=cnpj]")
    .val();
  postData.rua = $(formEle)
    .find("input[name=rua]")
    .val();
  postData.numero = $(formEle)
    .find("input[name=numero]")
    .val();
  postData.cidade = $(formEle)
    .find("input[name=cidade]")
    .val();
  postData.estado = $(formEle)
    .find("input[name=estado]")
    .val();
  postData.cep = $(formEle)
    .find("input[name=cep]")
    .val();
  postData.segmento = $(formEle)
    .find("input[name=segmento]")
    .val();

  $.ajaxSetup({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="_token"]').attr("content")
    }
  });

  $.ajax({
    type: "POST",
    data: formdata,
    url: getUrl() + "/clientes/data/alterar/registro",
    processData: false,
    contentType: false,
    success: function(resp) {
      HideLoading();
      toastr["success"]("Dados salvos com sucesso!");
      window.location = getUrl() + "/empresas";
    },
    error: function(jqXHR) {
      HideLoading();
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
    message: "Tem certeza que deseja remover essa empresa?",
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
            url: getUrl() + "/clientes/data/remove?id=" + id,
            success: function(resp) {
              HideLoading();
              toastr["success"]("Empresa removida com sucesso");
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
