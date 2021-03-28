/* eslint-disable */
import Vue from 'vue';
import Toast from '@/components/template/toast.vue';
var custom = {
  clickBtnAnimation(e) {
    let x = e.offsetX;
    let y = e.offsetY;

    let ripples = document.createElement('span');
    ripples.style.left = x + 'px';
    ripples.style.top = y + 'px';
    ripples.className = 'btnClick';
    e.target.appendChild(ripples);
    ripples.addEventListener('animationend', function() {
      ripples.remove();
    });
  },
  showToast(data) {
    if (!document.getElementById('toast-box')) {
      // Nếu không có #toast-box thì tạo ra #toast-box
      var toastBoxNew = document.createElement('div');
      toastBoxNew.id = 'toast-box';
      document.getElementById('app').appendChild(toastBoxNew);
    }

    let toastComp = Vue.extend(Toast);
    let toast = new toastComp({
      propsData: {
        data: {
          time: data.time || 2000,
          title: data.title, // bắt buộc
          message: data.message, // bắt buộc
          type: data.type || 0, // 0: success, 1: danger, 2: warning, 3: info
        },
      },
    }).$mount();

    let toastBox = document.getElementById('toast-box');
    if (toastBox.childNodes[0]) {
      toastBox.insertBefore(toast.$el, toastBox.childNodes[0]);
    } else {
      toastBox.appendChild(toast.$el);
    }
    toast.$el.onanimationend = function() {
      toast.$el.classList.add('fadeOut');
      toast.$el.onanimationend = function() {
        toast.$el.remove();
      };
    };
    // setTimeout(() => {
    //   toast.$el.classList.add('fadeOut');
    // }, data.time || 2000);
  },
};

export default custom;
