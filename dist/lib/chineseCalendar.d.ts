/**
 *
 * @param date Solar time string in ISO format.
 */
export declare const getChineseCalendar: (date?: string) => {
    公历: string;
    农历: string;
    干支: string;
    生肖: string;
    纳音: string;
    农历节日: string | undefined;
    公历节日: string | undefined;
    节气: string;
    二十八宿: string;
    彭祖百忌: string;
    喜神方位: string;
    阳贵神方位: string;
    阴贵神方位: string;
    福神方位: string;
    财神方位: string;
    冲煞: string;
    宜: string;
    忌: string;
};
