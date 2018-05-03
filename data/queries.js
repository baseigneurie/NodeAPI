module.exports = {
	// Course Search queries
    getTerms: `SELECT SWRPCTL_CRS_SRCH_TERM_5 as "TermCode", SWRPCTL_CRS_SRCH_TERM_DESC as "TermName", SWRPCTL_DEFAULT_TERM_IND as "default", SWRPCTL_PTRM_LIKE as "like", SWRPCTL_PTRM_NOT_LIKE as "notlike"` +
                `FROM SWRPCTL ` +
                `WHERE SWRPCTL_ENABLED = 'Y'`,
    getProgs: `CALL PW_ACTIVEPROGRAMS_GET(:p1, :ret)`,
	getLocs: `CALL PW_GETCAMPUS(:ret)`,
	getDelivery: `CALL PW_GETDELIVERYMETHOD(:ret)`,
    getSearchResults: `CALL PW_CourseSearch(:term, :dept, :subject, :course, :section, :title, :campus, :delivery, :program, :trmlike, :trmnotlike, :ret)`,
    getActiveDepartments: `CALL PW_GetDeptByTerm(:term, :ret)`,
    getCourseDetails: `CALL BANINST1.PW_CourseSearchDetail(:term, :crn, :ret)`,
    getResultsByCourse: `CALL BANINST1.PW_CourseSearchBYCOURSE(:subject, :course, :ret)`,

	// Gainful Employment Queries
    setAccept: `CALL BANINST1.RZPGERT.P_UpdateConfDate(:id, :ret)`,
    
    // User Management queries
    getSecretQuestions: `CALL GWKUSER.p_get_secret_questions(:ret, :return_val, :err_msg)`,
    verifyUnknownPass: `CALL GWKUSER.p_verify_unknown_pwd(:tpid, :squestion, :sanswer, :return_val, :err_msg)`,
    verifyFirstLogin: `CALL GWKUSER.p_verify_firsttime_login(:fname, :lname, :bdate, :id, :tpid, :return_val, :err_msg)`,
    insertFirstLogin: `CALL GWKUSER.p_insert_firsttime_login(:fname, :lname, :bdate, :id, :squestion, :sanswer, :pin, :tpid, :id_out, :return_val, :err_msg)`,
    getSearchData: `CALL GWKUSER.p_search_data(:id, :fname, :lname, :bdate, :tpid, :pin, :sectq, :id_out, :tpid_out, :return_val, :err_msg)`,

    //Logging queries
    logADError: `CALL GWKUSER.p_log_error(:rec_type, :proc, :id, :fname, :lname, :bdate, :tpid, :pin, :sectq, :secta, :retval, :err_msg, :success, :success_msg)`,
};
