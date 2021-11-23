// COLLECTION_ID: "planner"

// Plan tab only
// Plan tab에서 document write를 수행한다.
// 생성과 수정시 date_list에는 오늘이 포함 되어서는 안된다(내일것 부터 plan 가능)
// day_list와 week_list의 수정에 의해서 date_list를 수정할 시 오늘보다 작거나 같은 값들은 수정할 수 없다.

// plan된 대로 제대로 수행되었는지 알아보기 위해서는 date_list를 참조하여 해당 월의 daily_management 문서로 간다.
// date_list의 요소가 곧 daily_management의 필드 이름이 되고, 해당 필드(배열)에 plan_id를 가지고 있는 요소가 없거나,
// 해당 요소의 step이 done이 아니라면 plan이 제대로 수행되지 않은 것이다.
// 바꿔 말자하면, date_list 요소를 따라서 모든 daily_management 문서에 해당하는 필드(배열)에 plan_id를 가지는 요소가 존재하며 이들의 step이 모두 done이어야 한다.
// 코드를 작성하는 입장에서는 요소가 존재하지 않을 수 있음을 감안하여 작성한다.
// 제대로 수행되었거나 되고있는지 알아보는 행위는 reward에 반영하거나 진행정도 퍼센트를 알아내기 위해 수행된다(date_list 배열의 길이를 분모로, step이 done인 daily_management 필드의 개수를 분자로 한다)

export interface __DOC__PLANNER {
    counter: number;
    [key: string]: number | Plan;
}

interface Plan {
    // 2021-11-plan1
    plan_id: string;
    category: string;

    // this field might change its name
    sub_category: string;

    counter: number;
    
    min: number;
    name: string;
    time_option: string;
    // 0:sun ~ 6:sat
    day_list: Array<number>;
    // 0:week1 ~ N:end of week
    week_list: Array<number>;
    // 1~31
    date_list: Array<number>;
    progress: number;
}

/**
 * {
 *  counter: 3,
 *  2021-11-plan1: { plan_id: 2021-11-plan1, ... },
 *  2021-11-plan2: { plan_id: 2021-11-plan2, ... }
 * }
 */