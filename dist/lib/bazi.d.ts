import { Gender, HeavenStem, LunarHour, SixtyCycle } from 'tyme4ts';
export declare const buildHideHeavenObject: (heavenStem: HeavenStem | null | undefined, me: HeavenStem) => {
    天干: string;
    十神: string;
} | undefined;
/**
 * @param sixtyCycle 干支。
 * @param me 日主，如果sixtyCycle是日柱的话不传值。
 */
export declare const buildSixtyCycleObject: (sixtyCycle: SixtyCycle, me?: HeavenStem) => {
    天干: {
        天干: string;
        五行: string;
        阴阳: string;
        十神: string | undefined;
    };
    地支: {
        地支: string;
        五行: string;
        阴阳: string;
        藏干: {
            主气: {
                天干: string;
                十神: string;
            } | undefined;
            中气: {
                天干: string;
                十神: string;
            } | undefined;
            余气: {
                天干: string;
                十神: string;
            } | undefined;
        };
    };
    纳音: string;
    旬: string;
    空亡: string;
    星运: string;
    自坐: string;
};
export declare const buildBazi: (options: {
    lunarHour: LunarHour;
    eightCharProviderSect?: 1 | 2;
    gender?: Gender;
}) => {
    性别: string;
    阳历: string;
    农历: string;
    八字: string;
    生肖: string;
    日主: string;
    年柱: {
        天干: {
            天干: string;
            五行: string;
            阴阳: string;
            十神: string | undefined;
        };
        地支: {
            地支: string;
            五行: string;
            阴阳: string;
            藏干: {
                主气: {
                    天干: string;
                    十神: string;
                } | undefined;
                中气: {
                    天干: string;
                    十神: string;
                } | undefined;
                余气: {
                    天干: string;
                    十神: string;
                } | undefined;
            };
        };
        纳音: string;
        旬: string;
        空亡: string;
        星运: string;
        自坐: string;
    };
    月柱: {
        天干: {
            天干: string;
            五行: string;
            阴阳: string;
            十神: string | undefined;
        };
        地支: {
            地支: string;
            五行: string;
            阴阳: string;
            藏干: {
                主气: {
                    天干: string;
                    十神: string;
                } | undefined;
                中气: {
                    天干: string;
                    十神: string;
                } | undefined;
                余气: {
                    天干: string;
                    十神: string;
                } | undefined;
            };
        };
        纳音: string;
        旬: string;
        空亡: string;
        星运: string;
        自坐: string;
    };
    日柱: {
        天干: {
            天干: string;
            五行: string;
            阴阳: string;
            十神: string | undefined;
        };
        地支: {
            地支: string;
            五行: string;
            阴阳: string;
            藏干: {
                主气: {
                    天干: string;
                    十神: string;
                } | undefined;
                中气: {
                    天干: string;
                    十神: string;
                } | undefined;
                余气: {
                    天干: string;
                    十神: string;
                } | undefined;
            };
        };
        纳音: string;
        旬: string;
        空亡: string;
        星运: string;
        自坐: string;
    };
    时柱: {
        天干: {
            天干: string;
            五行: string;
            阴阳: string;
            十神: string | undefined;
        };
        地支: {
            地支: string;
            五行: string;
            阴阳: string;
            藏干: {
                主气: {
                    天干: string;
                    十神: string;
                } | undefined;
                中气: {
                    天干: string;
                    十神: string;
                } | undefined;
                余气: {
                    天干: string;
                    十神: string;
                } | undefined;
            };
        };
        纳音: string;
        旬: string;
        空亡: string;
        星运: string;
        自坐: string;
    };
    胎元: string;
    胎息: string;
    命宫: string;
    身宫: string;
    神煞: {
        年柱: string[];
        月柱: string[];
        日柱: string[];
        时柱: string[];
    };
    大运: {
        起运日期: string;
        起运年龄: number;
        大运: any[];
    };
    刑冲合会: Record<string, import("cantian-tymext").PillarRelation>;
};
