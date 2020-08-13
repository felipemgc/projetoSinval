var APP = {
  setup: function () {
    if (jQuery('[data-identifier="home"]').length > 0) {
      APP.Home.setup();
    }
  },
  Home: {
    setup: function () {
      // APP.Home.filters();
      $('.mask-date').mask('00/00/0000', { clearIfNotMatch: true });
      $('.mask-phone').mask('(00) 0000-0000P', { clearIfNotMatch: true, 'translation': { P: { pattern: /[0-9]/, optional: true } } });
      $('.mask-cep').mask('00000-000', { reverse: true, clearIfNotMatch: true });
      $('.mask-cnpj').mask('00.000.000/0000-00', { reverse: true, clearIfNotMatch: true });
      $('.mask-numberonly').mask('0#');

    }
  }
}

jQuery(document).ready(function ($) {
  if (jQuery("[data-identifier='application-body']").length > 0) {
    APP.setup();
  }

});

