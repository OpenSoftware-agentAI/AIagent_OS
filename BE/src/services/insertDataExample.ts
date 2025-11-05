import prisma from "../../prisma/client";
/**
 * 해당 파일은 저작권 보호를 위하여 
 * 예시 및 주석 설명으로 대체됩니다. 
 * 
 * 업로드된 파일의 내용을 데이터베이스에 저장하는 파일입니다. 
 * 
 */

export async function createStudentData(data: {
  /**
   * ex
   * name : string;
   */

}) {
  return await prisma.studentData.create({
    data: {
      
  /**
   * ex
   * name: data.name  
   */
    },
  });
}

// 그 외 다른 함수들... 

export async function createClassRecord(classInfo: {
      /***
       * ex
       * testName
       */
    },
}) {
  return await prisma.classRecord.create({
    data: {
            /***
       * ex
      * test: string;
       */
    },
 
    },
  });
}

export async function createCommentSrc(
      /***
       * ex
       * test: string;
       */
    },
) {
  return await prisma.commentSrc.create({
    data: {
      /***
       * ex
       * test
       */
    },
  });
}

export async function createStudentComment(
  studentDataId: string,
  generatedText: string,
  isSentToParent: boolean = false
) {
  console.log(`--- DEBUG: 'connect' 버전의 createStudentComment 실행 중. ID: ${studentDataId} ---`);

// create 대신 upsert를 사용합니다.
  return await prisma.studentComment.upsert({
    
    // 1. studentDataId를 기준으로 기존 코멘트를 찾습니다.
    where: {
      studentDataId: studentDataId,
    },
    
    // 2. 기존 코멘트가 있으면, generatedText를 업데이트합니다.
    update: {
      generatedText: generatedText,
      isSentToParent: isSentToParent,
      createdAt: new Date(), // 덮어쓸 때 시간도 갱신
    },
    
    // 3. 기존 코멘트가 없으면, 새로 생성합니다.
    create: {
      generatedText,
      isSentToParent,
      studentData: {
        connect: { id: studentDataId },
      },
    },
  });
}
