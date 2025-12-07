import { Student } from './types';

export const CLASS_NAME = "2028届11班";
export const SCHOOL_NAME = "定边县实验中学";

// Updated list of students provided by user
const NAMES = [
  "解子耘", "宁嘉庆", "范昱婷", "白佳园", "赵利芳", "文昊智", "李衍", "吴芝婷", "石佳鑫", "任君华",
  "白佳敏", "李政林", "路淇", "张博杨", "郑嘉妮", "贺彦龙", "王玉蓉", "魏雪唲", "刘思逸", "刘亦彤",
  "李佳雪", "齐彩玲", "田景怡", "周子诺", "谢雨升", "王文宵", "白佳倪", "高培翔", "柴嘉宇", "卯琪琪",
  "李孜懿", "魏清杰", "陈依娜", "何俞莹", "苗煜佳", "李佳鑫", "张巧雲", "徐嘉敏", "顾晶晶", "高宁",
  "王滔", "侯皓杰", "尉宏飞", "郑景熙", "吴雨荷", "李嘉明", "李天骐", "孙雨晨", "秦艺航", "温宝库",
  "王钰婷", "吕雅偌"
];

export const INITIAL_STUDENTS: Student[] = NAMES.map((name, index) => ({
  id: index + 1,
  name,
  status: 'absent'
}));