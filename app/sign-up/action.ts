'use server'

export async function completeSignUpAction(
  prevState: { message: string },
  formData: FormData,
) {
  const repoName = formData.get('repo_name')
  console.log('formData---', repoName)

  return {
    message: 'Please enter a valid email',
  }
}
