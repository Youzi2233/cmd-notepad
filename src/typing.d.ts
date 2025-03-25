export type CMDListType = {
  /** 脚本key*/
  [key: string]: {
    /**
     * 脚本执行命令
     */
    main: string;
    /**
     * 主脚本被切换或删除后执行的销毁命令
     */
    onDestroy?: string;
  };
};
