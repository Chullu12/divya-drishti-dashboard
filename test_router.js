import { parseStudentCommand, parseTeacherCommand } from './src/utils/aiCommandRouter.js';

async function test() {
    console.log("Testing student command 'go to vision'");
    const res1 = await parseStudentCommand("go to vision");
    console.log(res1);

    console.log("Testing student command 'scan this object'");
    const res2 = await parseStudentCommand("scan this object");
    console.log(res2);
}

test();
