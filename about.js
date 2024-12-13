import { i18n } from './i18n.js';

$(document).ready(async function() {
    await i18n.init();
    
    // 更新当前页面的 active 状态
    $('.nav-item').removeClass('active');
    $('a[href="about.html"]').parent().addClass('active');
}); 