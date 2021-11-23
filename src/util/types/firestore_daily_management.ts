// COLLECTION_ID: "daily_management"

// Home tab only
// 원래는 비어있고 우리는 언제나 planner 문서를 보고 default 값을 낼 수 있어야 한다.
// 만약 user가 home tab에서 어떤 task를 누르고 작업을 수행하면 그 때 document write를 한다.
// !!!눌러서 mode를 설정한다면 바로 write를 수행한다.

// 예를들어 오늘이 11/23일이고 plan_id: 2021-11-plan5를 수행해야 하는 날을 가정해보자.
// 우선 daily_management 문서의 23 필드를 본다. 이 배열에 
// 1) 데이터가 있는 경우 데이터를 보여준다.
// 2) 데이터가 없지만 planner 문서에 의해서 오늘의 task가 존재해야 한다면 planner 문서의 정보를 기반하여 default 값을 보여주고, document write는 수행하지 않는다.
// 2의 상태로 user가 task의 mode설정도 안했다면(수행하지 않았다면) 이 사실은 daily_management문서에서는 알 수 없다.
// 대신 planner 문서의 date_list 값을 보고, 23 field의 배열에 plan_id 알아서 user가 해당 task를 수행하지 않았다는 것을 알 수 있다.
// 오로지 Home tab에서 수행된 내용들을 바탕으로 작성하는 문서이다.
// task를 진행하면, 23 필드 배열을 수정해준다.
// mode를 설정할 때 배열에 요소를 삽입해주었기 때문에 plan_id를 통해 탐색이 가능하다.

export interface __DOC__DAILY_MANAGEMENT {
    [key: string]: Array<DailyMangementUnit>
}

interface DailyMangementUnit {
    plan_id: string;
    date: number;
    min: number;
    fulfilled: number;
    mode: "timer" | "record";
    name: string;
    step: string;
    time_option: string;
    result_list: Array<string>;
}

/**
 * {
 *  1: [{plan_id: 2021-11-plan1 ...}, ...]
 * }
 */

