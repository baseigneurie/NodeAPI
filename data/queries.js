module.exports = {
    getTerms: `SELECT SWRPCTL_CRS_SRCH_TERM_5 as "TermCode", SWRPCTL_CRS_SRCH_TERM_DESC as "TermName", SWRPCTL_DEFAULT_TERM_IND as "default" ` +
                `FROM SWRPCTL ` +
                `WHERE SWRPCTL_ENABLED = 'Y'`,
    getDepts: `SELECT STVDEPT_CODE as "DeptCode", STVDEPT_DESC as "DeptDescription" ` +
                `FROM STVDEPT ` +
                `WHERE STVDEPT_CODE != '0000'`,
    getProgs: `CALL PW_ACTIVEPROGRAMS_GET(:p1, :ret)`,
    getLocs: `SELECT STVCAMP_CODE as "CampCode", STVCAMP_DESC as "CampDesc", STVCAMP_DICD_CODE as "DICDCode" ` +
                `FROM STVCAMP ` +
                `ORDER BY STVCAMP_DESC`,
    getDelivery: `SELECT DISTINCT FW_GET_DEL_TYPE (S1.STVSCHD_CODE) AS "DeliveryType" ` +
                    `FROM STVSCHD S1 ` +
                    `WHERE S1.STVSCHD_CODE NOT IN ('PBC', 'VBC', 'CD')`,
    getSearchResults: `CALL PW_CourseSearch(:term, :dept, :subject, :course, :section, :title, :campus, :delivery, :program, :trmlike, :trmnotlike, :ret)`,
    getActiveDepartments: `CALL PW_GetDeptByTerm(:term, :ret)`,
    getCourseDetails: `CALL BANINST1.PW_CourseSearchDetail(:term, :crn, :ret)`
};
