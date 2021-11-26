// ===METADATA===
// COLLECTION_ID: "daily_management"
// DOCUMENT_ID: <year>-<month>-<date>-<planner_id>
// ex)2021-9-23-lJbXfbkXcHCnqZsXdJ4w
// ex)2021-11-23-lJbXfbkXcHCnqZsXdJ4w
// 문서 생성시점: Home탭에서 mode를 누르고, 시간을 설정하는 작업을 마치면.

// ===OPERATION===
// write: Home tab only
// read: Home tab only

// ===IMPLEMENTATION===
// user/$uid/daily_management collection에 where("year_month", "in", [$YYYY-M(last month), $YYYY-M(this month)]) onSnapshot 리스너를 단다.
// next month에 대해서는 아직 생성된 문서가 하나도 없다(metadata '문서 생성시점' 참고)
// (오늘이 달의 첫 날이고 어제가 전달의 마지막날인 경우의 수 때문. 이번달과 전달의 연도가 다를수 있으므로 date object를 이용하여 달을 이동하자)
// 조건에 맞는 모든 문서들을 읽어온 뒤 Map type(*)에 저장한다.

// yesterday/today/tomorrow에 적합한 데이터를 추출한다:
// Planner
// Map의 key값을 추출한 다음 startsWith($YYYY-M-D)를 이용한 filter를 통해 yesterday/today/tomorrow 데이터를 뽑아낸다.
// 

export interface __DOC__DAILY_TASK {
    planner_id: string;
    year_month: string;

    // 1~31
    date: number;
    min: number;
    fulfilled: number;
    mode: "timer" | "record";
    step: string;
    time_option: string;
    result_list: Array<string>;
}

/**
 * {
 *  1: [{plan_id: 2021-11-plan1 ...}, ...]
 * }
 */

