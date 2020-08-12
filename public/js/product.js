const app = new Vue({
  el: "#app",
  data() {
    return {
      type: 'add',
      message: "xxxx",
      products: null,
      categories: null,
      vendors: null,
      productStatus: null,
      tempProduct: {
        more_information: '',
        category_id: [],
        colors: [],
        description: '',
        discount: 0,
        galleries: [],
        id: '',
        price: 0,
        product_code: '',
        sizes: [],
        status: '',
        thumbnail: '',
        title: '',
        vendor_id: '',
      },
      tempProductDefault: {
        more_information: '',
        category_id: [],
        colors: [],
        description: '',
        discount: 0,
        galleries: [],
        id: '',
        price: 0,
        product_code: '',
        sizes: [],
        status: '',
        thumbnail: '',
        title: '',
        vendor_id: '',
      },
      selectNodeRefsMapCustomSelect: {
        category: null,
        vendor: null
      }
    };
  },
  watch: {
    categories: function (val) {
      setTimeout(() => {
        this.selectNodeRefsMapCustomSelect.category.refresh()
      }, 100)
    },
    'tempProduct.vendor_id': function (val) {
      this.selectNodeRefsMapCustomSelect.vendor.setValue(this.tempProduct.vendor_id ? this.tempProduct.vendor_id.id : '', false)
    },
    'tempProduct.category_id': function (val) {
      this.selectNodeRefsMapCustomSelect.category.setValue(this.tempProduct.category_id.map(it => it.id), false)
    },
    'tempProduct.status': function (val) {
      this.selectNodeRefsMapCustomSelect.status.setValue(this.tempProduct.status ? this.tempProduct.status.id : '', false)
    },
    vendors: function (val) {
      setTimeout(() => {
        this.selectNodeRefsMapCustomSelect.vendor.refresh()
      }, 100)
    },
    productStatus: function (val) {
      setTimeout(() => {
        this.selectNodeRefsMapCustomSelect.status.refresh()
      }, 100)
    },
    'tempProduct.more_information': function (val) {
      $('#more_information').summernote('code', val)
    }
  },
  created() {
    this.fetchData({
      url: "/api/products",
      field: 'products'
    });
    this.fetchData({
      url: "/api/categories",
      field: 'categories'
    });
    this.fetchData({
      url: "/api/vendors",
      field: 'vendors'
    });
    this.fetchData({
      url: "/api/product-status",
      field: 'productStatus'
    });
  },
  mounted() {
    setTimeout(function (e) {
      $('#more_information').summernote({
        placeholder: 'Type something...',
        height: 136,
        callbacks: {
          onChange: (contents, $editable) => {
            Vue.set(app.tempProduct, 'more_information', contents);
          }
        }
      });

      document.querySelectorAll('.custom-select').forEach(_selectNode => {
        app.selectNodeRefsMapCustomSelect[_selectNode.getAttribute('id')] = new CustomSelect(_selectNode, {
          labelClass: 'form-control'
        })
      })
    }, 0)
  },
  methods: {
    fetchData: function ({ url, field, defaultValue = null, callback }) {
      $.ajax({
        url,
        success: function (data) {
          Vue.set(app, field, { ...data.data })
        },
        err: function (err) {
          app[field] = defaultValue
        }
      });
    },
    saveProduct() {
      console.log(this.tempProduct.colors)

      $.ajax({
        url: `/api/products${app.type === 'add' ? '' : `/${this.tempProduct._id}`}`,
        method: app.type === 'add' ? 'PUT' : 'POST',
        data: {
          ...this.tempProduct,
          category_id: this.selectNodeRefsMapCustomSelect.category.getValue(),
          colors: this.tempProduct.colors ? (Array.isArray(this.tempProduct.colors) ? this.tempProduct.colors : this.tempProduct.colors.split(',')) : null,
          sizes: this.tempProduct.sizes ? Array.isArray(this.tempProduct.sizes) ? this.tempProduct.sizes : this.tempProduct.sizes.split(',') : null,
          status: this.selectNodeRefsMapCustomSelect.status.getValue(),
          vendor_id: this.selectNodeRefsMapCustomSelect.vendor.getValue()
        },
        success: function (data) {
          app.fetchData({
            url: "/api/products",
            field: 'products'
          })

          app.resetForm()
        }
      })
    },
    editProduct(product) {
      this.type = 'edit';
      this.tempProduct = { ...product }
    },
    resetForm() {
      this.type = 'add';
      this.tempProduct = { ...this.tempProductDefault }
    }
  },
});



