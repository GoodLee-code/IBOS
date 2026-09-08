(function (window) {
  "use strict";

  window.pageDocumentation = {
    "商户号管理": {
      page: {
        title: "商户号管理"
      },
      fields: [],
      functions: [],
      businessRules: [],
      interactions: []
    },
    "微信交易账单": {
      page: {
        title: "微信交易账单"
      },
      fields: [],
      functions: [],
      businessRules: [],
      interactions: []
    },
    "商户号投诉管理": {
      page: {
        title: "商户号投诉管理"
      },
      fields: [],
      functions: [],
      businessRules: [],
      interactions: []
    },
    "退款管理": {
      page: {
        title: "退款管理"
      },
      note: {
        label: "备注",
        text: "测试用商户订单号",
        code: "JH202608050002"
      },
      fields: [],
      functions: [
        {
          title: "状态数量统计",
          description: "未退款状态 Tab 栏中数量为退款申请单号数量，其余独立状态为退款单号数量。"
        },
        {
          title: "撤销退款",
          description: "操作撤销退款时，该退款申请单下非已退款状态的退款都撤销退款。"
        }
      ],
      businessRules: [
        {
          title: "退款申请限制",
          description: "每笔订单号支持提交多个退款申请，但每个手机号仅支持同时存在一个未退款的退款申请单。"
        },
        {
          title: "可退款金额",
          description: "商户订单号对应可退款金额 = 支付金额 - 已退款金额 + 待确认收款金额。"
        }
      ],
      interactions: []
    }
  };
})(window);
